import { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material'
import { apiClientProxy } from 'services/networking/client'
import Loader from 'ui/Loader'
import { useEmailCampaignReportsCache } from '../../../../redux/dashboard/hooks'
import Percentage from 'ui/Percentage'
import ErrorComponent from 'components/ErrorComponent/ErrorComponent'
import SentEmailCampaignListTitle from './SentEmailCampaignListTitle'

function SentEmailCampaignList() {
  const [emailCampaignReports, setEmailCampaignReports] = useEmailCampaignReportsCache()
  const [errorMessage, setErrorMessage] = useState()

  useEffect(() => {
    const getEmailCampaignReports = async () => {
      try {
        if (emailCampaignReports === null) {
          setEmailCampaignReports(await apiClientProxy.get('/mailCampaign/reports'))
        }
      } catch (error) {
        setErrorMessage(error)
      }
    }
    getEmailCampaignReports()
  }, [emailCampaignReports, setEmailCampaignReports])

  const emailCampaignsContent = () => {
    const campaignsExist = emailCampaignReports && emailCampaignReports.map(item => item.campagnes.length > 0)
    const noCampaign = emailCampaignReports && emailCampaignReports.map(item => item.campagnes.length === 0)

    if (emailCampaignReports !== null && campaignsExist.some(val => val)) {
      return (
        <>
          <SentEmailCampaignListTitle />
          {emailCampaignReports.map(item =>
            item.campagnes.map((el, index) => (
              <Grid container className="with-background dc-container big-card" key={index + 1}>
                <Grid container className="title-row">
                  <Grid item xs={12}>
                    <p className="headline">{el.titre}</p>
                  </Grid>
                  <Grid item xs={12}>
                    <p className="subtitle-text-card">
                      Le {new Date(el.date).toLocaleDateString()}, par {el.auteur}
                    </p>
                  </Grid>
                </Grid>
                <Grid container className="flash-card-row">
                  <Grid item xs={5} sm={3} className="flash-card">
                    <Grid item className="flash-card-item">
                      <div className="info-number">{el.nbEmails}</div>
                      <div className="text-below-info-number">Email{el.nbEmails > 1 && 's'}</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className="flash-card">
                    <Grid item className="flash-card-item">
                      <div className="info-number">
                        <Percentage>{el.txOuverture}</Percentage>
                        <span className="parenthese-info">({el.nbOuvertures})</span>
                      </div>
                      <div className="text-below-info-number">Ouvertures</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className="flash-card">
                    <Grid item className="flash-card-item">
                      <div className="info-number">
                        <Percentage>{el.txClique}</Percentage>
                        <span className="parenthese-info">({el.nbCliques})</span>
                      </div>
                      <div className="text-below-info-number">Clics</div>
                    </Grid>
                  </Grid>
                  <Grid item xs={5} sm={3} className="flash-card">
                    <Grid item className="flash-card-item">
                      <div className="info-number">
                        <Percentage>{el.txDesabonnement}</Percentage>
                        <span className="parenthese-info">({el.nbDesabonnements})</span>
                      </div>
                      <div className="text-below-info-number">Désabonnements</div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))
          )}
        </>
      )
    }
    if (emailCampaignReports !== null && noCampaign.every(val => val)) {
      return (
        <>
          <SentEmailCampaignListTitle />
          <Box className="with-background dc-container" style={{ textAlign: 'center', padding: '6px' }}>
            Aucune campagne à afficher
          </Box>
        </>
      )
    }
    if (errorMessage) {
      return (
        <Box>
          <ErrorComponent errorMessage={errorMessage} />
        </Box>
      )
    }
    return (
      <>
        <Box className="with-background dc-container" style={{ textAlign: 'center' }}>
          <Loader />
        </Box>
      </>
    )
  }
  return <>{emailCampaignsContent()}</>
}

export default SentEmailCampaignList
