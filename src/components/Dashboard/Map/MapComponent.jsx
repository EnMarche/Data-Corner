import React, { useState, useEffect } from 'react';
import {
    MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import L from 'leaflet';
import { Grid, Box } from '@material-ui/core';
import { useDashboardSurveyCache } from '../../../redux/dashboard/hooks';
import { apiClientProxy } from '../../../services/networking/client';
import Loader from '../../Loader';
import { useUserScope } from '../../../redux/user/hooks';
import ErrorComponent from '../../ErrorComponent/ErrorComponent';

function MapComponent() {
    const [dashboardSurvey, setDashboardSurvey] = useDashboardSurveyCache();
    const [currentScope] = useUserScope();
    const [hasError, setHasError] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getSurvey = async () => {
            try {
                if (dashboardSurvey === null && currentScope) {
                    setDashboardSurvey(await apiClientProxy.get('/jemengage/survey'));
                }
            } catch (error) {
                setHasError(true);
                setErrorMessage(error);
            }
        };
        getSurvey();
    }, [dashboardSurvey]);

    L.Icon.Default.imagePath = 'images/';

    const dashboardSurveyContent = () => {
        if (dashboardSurvey !== null) {
            return (
                <>
                    <Grid container style={{ padding: '16px' }}>
                        <span className="count-bubble">{ dashboardSurvey.survey_datas.length }</span>
                        <Grid item>
                            <Box className="chart-title">Questionnaire{ dashboardSurvey.survey_datas.length > 1 && 's' } rempli{ dashboardSurvey.survey_datas.length > 1 && 's' }</Box>
                            <Box className="chart-subtitle">Répartition géographique dans votre région</Box>
                        </Grid>
                    </Grid>
                    <MapContainer
                        center={[dashboardSurvey.latitude, dashboardSurvey.longitude]}
                        zoom={8}
                    >
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        />

                        {dashboardSurvey.survey_datas.map((data) => (
                            <Marker key={data.id} position={[data.latitude, data.longitude]}>
                                <Popup>
                                    <strong>Nom du sondage:</strong> {data.survey.name} <br />
                                    <strong>Répondu le:</strong> {data.posted_at}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </>
            );
        } if (hasError) {
            return <ErrorComponent errorMessage={errorMessage} />;
        }
        return <Box style={{ textAlign: 'center' }}><Loader /></Box>;
    };

    return (
        <>
            {dashboardSurveyContent()}
        </>
    );
}

export default MapComponent;
