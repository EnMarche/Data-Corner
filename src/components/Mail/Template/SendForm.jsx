import React, { useEffect, useState } from 'react';

import {
    Grid, Button, TextField, ButtonGroup, Box,
} from '@material-ui/core';
import Loader from '../../Loader';
import { apiClient } from '../../../services/networking/client';
import { useTemplateContent } from '../../../redux/template/hooks';
import { useUserScope } from '../../../redux/user/hooks';

const BUTTON_INITIAL_STATE = { state: 'send', isLoading: false, inputError: false };
const EMAIL_INITIAL_STATE = { synchronized: false };

const SendForm = () => {
    const [content] = useTemplateContent();
    const [emailSubject, setEmailSubject] = useState('');
    const [buttonState, setButtonState] = useState(BUTTON_INITIAL_STATE);
    const [email, setEmail] = useState(EMAIL_INITIAL_STATE);
    const [currentScope] = useUserScope();

    const resetEmailState = () => {
        setEmail((state) => ({ ...state, ...EMAIL_INITIAL_STATE }));
        setButtonState(BUTTON_INITIAL_STATE);
    };

    function clearBody(body) {
        return body.substring(body.indexOf('<table'), body.lastIndexOf('</table>') + 8);
    }

    useEffect(resetEmailState, [content]);

    const handleSendEmail = async (test = false) => {
        if (test) {
            await apiClient.post(`/v3/adherent_messages/${email.uuid}/send-test`);

            return;
        }

        if (!email.synchronized || email.recipient_count < 1) {
            throw new Error('Send not allowed');
        }

        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        const response = await apiClient.post(`/v3/adherent_messages/${email.uuid}/send`);

        setEmail((state) => ({ ...state, ...{ synchronized: false } }));

        if (response === 'OK') {
            setButtonState((state) => ({ ...state, ...{ state: 'success', isLoading: false } }));
        } else {
            setButtonState((state) => ({ ...state, ...{ state: 'error', isLoading: false } }));
        }
    };

    const editEmail = async () => {
        const body = {
            type: currentScope.code,
            label: `DataCorner: ${emailSubject}`,
            subject: emailSubject,
            content: clearBody(content.chunks.body),
        };

        if (email.uuid) {
            return apiClient.put(`/v3/adherent_messages/${email.uuid}`, body);
        }

        return apiClient.post('/v3/adherent_messages', body);
    };

    const getEmailStatus = (uuid) => apiClient.get(`/v3/adherent_messages/${uuid}`);

    const handleClickSendButton = async () => {
        setButtonState((state) => ({ ...state, ...{ isLoading: true } }));

        // step 1: create email
        const response = await editEmail();
        setEmail((state) => ({ ...state, ...response }));

        // step 2: check email status
        let callCount = 0;
        const emailUuid = response.uuid || email.uuid;

        if (!emailUuid) {
            return;
        }

        const timer = setInterval(async () => {
            const emailStatusResponse = await getEmailStatus(emailUuid);

            // eslint-disable-next-line no-plusplus
            if (++callCount >= 10 || (emailStatusResponse.synchronized === true)) {
                clearInterval(timer);
                setEmail((state) => ({ ...state, ...emailStatusResponse }));
                setButtonState((state) => ({ ...state, ...{ state: 'confirme', isLoading: false } }));
            }
        }, 2000);
    };

    let sendButton;

    if (buttonState.state === 'send') {
        const disableState = !content || buttonState.isLoading || !emailSubject;
        sendButton = (
            <Button
                className={`material-button ${disableState ? 'disabled' : null} btn btn-dc-primary`}
                onClick={disableState ? null : handleClickSendButton}
                onMouseEnter={() => setButtonState((state) => ({ ...state, ...{ inputError: !emailSubject } }))}
                onMouseLeave={() => setButtonState((state) => ({ ...state, ...{ inputError: false } }))}
                style={{ height: '38px' }}
            >
                <Box component="span" style={{ marginRight: '8px' }}>
                    {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                </Box>
                Préparer l’envoi
            </Button>
        );
    } else if (buttonState.state === 'confirme') {
        sendButton = (
            <>
                <ButtonGroup style={{ width: '100%', height: '38px !important' }}>
                    <Button
                        className="material-button btn btn-dc-primary"
                        type="button"
                        onClick={() => handleSendEmail()}
                        disabled={!email.recipient_count || email.recipient_count < 1}
                    >
                        <Box component="span" style={{ marginRight: '8px' }}>
                            {buttonState.isLoading ? <Loader /> : <i className="fa fa-paper-plane-o" />}
                        </Box>
                        Envoyer
                    </Button>
                    <Button
                        type="button"
                        className="btn btn-dc-outline-primary"
                        onClick={() => handleSendEmail(true)}
                        style={{
                            color: '#0049C6',
                            border: '1px solid #0049C6',
                            borderLeft: '0',
                            background: 'white',
                            width: '100%',
                        }}
                    >
                        M’envoyer un test
                    </Button>
                </ButtonGroup>
                <Grid container>
                    <Grid item style={{ margin: '8px auto 0' }}>
                        {email.recipient_count} contact{email.recipient_count > 1 && 's'}
                    </Grid>
                </Grid>
            </>
        );
    } else if (buttonState.state === 'success') {
        sendButton = (
            <Button container className="btn" type="button" disabled style={{ width: '100%', border: '1px solid #28A745', color: '#28A745' }}>
                <Box component="span" style={{ marginRight: '8px' }}>
                    <i className="fa fa-check" />
                </Box>
                E-mail envoyé 🎉
            </Button>
        );
    } else if (buttonState.state === 'error') {
        sendButton = (
            <Button className="btn" type="button" disabled style={{ width: '100%', border: '1px solid #DC3545', color: '#DC3545' }}>
                <Box component="span" style={{ marginRight: '8px' }}>
                    <i className="fa fa-bomb" />
                </Box>
                Une erreur est survenue
            </Button>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={8} style={{ paddingTop: '0' }}>
                <TextField
                    label="Objet du mail"
                    error={buttonState.inputError}
                    style={{ width: '100%' }}
                    size="small"
                    value={emailSubject}
                    onChange={(event) => setEmailSubject(event.target.value)}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                {sendButton}
            </Grid>
        </Grid>
    );
};

export default SendForm;
