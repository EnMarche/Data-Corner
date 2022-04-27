import { useState } from 'react'
import { useParams } from 'react-router'
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { v1 as uuid } from 'uuid'

import Loading from 'components/Dashboard/shared/Loading'
import { useQueryWithScope } from 'api/useQueryWithScope'
import { getDTDCampaignSurveysAddress } from 'api/DTD'
import { useErrorHandler } from 'components/shared/error/hooks'
import { shouldForwardProps } from 'components/shared/shouldForwardProps'
import { TruncatedText } from 'components/shared/styled'
import { surveysColumnsStyles } from './shared/helpers'
import CampaignDetailSurveysExport from './CampaignDetailSurveysExport'

const TableCell = styled(
  MuiTableCell,
  shouldForwardProps
)(({ theme, isOdd = false, isSticky = false, answerType }) => ({
  padding: theme.spacing(1.5, 2),
  ...(isOdd
    ? {
        backgroundColor: theme.palette.campaign.background.table.cell.odd,
      }
    : {}),
  ...(isSticky
    ? {
        position: 'sticky',
        left: 0,
        backgroundColor: theme.palette.campaign.background.table.cell[isOdd ? 'odd' : 'even'],
        borderRight: `1px solid ${theme.palette.campaign.background.table.cell.border}`,
      }
    : {}),
  ...surveysColumnsStyles[answerType],
}))
const ColumnLabel = styled(({ isTruncated = false, ...props }) =>
  isTruncated ? <TruncatedText variant="subtitle2" {...props} /> : <Typography variant="subtitle2" {...props} />
)(
  ({ theme }) => `
	color: ${theme.palette.gray800};
	font-weight: 600;
`
)

const Description = styled(props => <Typography variant="subtitle2" component="div" {...props} />)(
  ({ theme }) => `
	height: 18px;
	color: ${theme.palette.gray700};
	font-weight: 500;
`
)
const SubDescription = styled(props => <Typography component="div" {...props} />)(
  ({ theme }) => `
	height: 15px;
	color: ${theme.palette.gray600};
	font-size: 10px;
	font-weight: 400;
	line-height: 15px;
`
)

const messages = {
  doorKnockers: 'Porte-à-porteur',
  address: 'Adresse',
  buildingType: 'Type Bâtiment',
  status: 'Statut',
  doorsKnocked: 'Portes frappées',
  anonymous: 'Anonyme',
}

const formatQuestioner = ({ firstName, lastName }) => `${lastName?.toUpperCase()} ${firstName}`

const CampaignDetailAddresses = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [order, toggleOrder] = useState({})
  const { handleError } = useErrorHandler()
  const { campaignId } = useParams()

  const handleChangePage = (_, page) => {
    setCurrentPage(page)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setCurrentPage(0)
  }

  const handleSort = column => () => {
    toggleOrder(order => ({ [column]: order[column] === 'asc' ? 'desc' : 'asc' }))
  }

  const { data: surveys = {}, isLoading: isSurveysLoading } = useQueryWithScope(
    [
      'surveys-detail-address',
      {
        feature: 'DTD',
        view: 'CampaignDetailSurveysAddress',
        pageNumber: currentPage,
        pageSize: rowsPerPage,
        sortParam: order,
      },
      campaignId,
    ],
    () =>
      getDTDCampaignSurveysAddress({ campaignId, pageSize: rowsPerPage, pageNumber: currentPage, sortParam: order }),
    {
      onError: handleError,
    }
  )
  const surveysTotalCount = surveys?.totalCount
  const addresses = surveys?.addresses

  if (addresses?.length === 0) return null
  if (isSurveysLoading) return <Loading />

  return (
    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} data-cy="campaign-campaign-detail-surveys">
      <Paper sx={{ borderRadius: 3 }}>
        <TableContainer sx={{ borderRadius: 3 }}>
          <Table sx={{ borderCollapse: 'separate' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell key={uuid()}>
                  <ColumnLabel>{messages.address}</ColumnLabel>
                </TableCell>
                <TableCell key={uuid()}>
                  <TableSortLabel direction={order.buildingType} onClick={handleSort('buildingType')} active>
                    <ColumnLabel>{messages.buildingType}</ColumnLabel>
                  </TableSortLabel>
                </TableCell>
                <TableCell key={uuid()}>
                  <TableSortLabel direction={order.status} onClick={handleSort('status')} active>
                    <ColumnLabel>{messages.status}</ColumnLabel>
                  </TableSortLabel>
                </TableCell>
                <TableCell key={uuid()}>
                  <TableSortLabel direction={order.doorsKnocked} onClick={handleSort('doorsKnocked')} active>
                    <ColumnLabel>{messages.doorsKnocked}</ColumnLabel>
                  </TableSortLabel>
                </TableCell>
                <TableCell key={uuid()} isSticky>
                  <ColumnLabel>{messages.doorKnockers}</ColumnLabel>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {addresses?.map(
                ({ address, cityName, inseeCode, buildingType, status, numberVisitedDoors, questioner }, index) => (
                  <TableRow key={uuid()} sx={{ width: '175px' }}>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '220px' }}>
                      <Description>{address}</Description>
                      <SubDescription>{`${inseeCode} ${cityName}`}</SubDescription>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '150px' }}>
                      <Description>{buildingType}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '150px' }}>
                      <Description>{status}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} sx={{ width: '150px' }}>
                      <Description>{numberVisitedDoors}</Description>
                    </TableCell>
                    <TableCell key={uuid()} isOdd={!!(index % 2)} isSticky>
                      <Description>
                        {questioner?.lastName || questioner?.firstName
                          ? formatQuestioner(questioner)
                          : messages.anonymous}
                      </Description>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component={({ children, ...props }) => (
            <Grid container justifyContent="space-between" alignItems="center">
              <CampaignDetailSurveysExport />
              <Grid item {...props}>
                {children}
              </Grid>
            </Grid>
          )}
          count={surveysTotalCount}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Grid>
  )
}

export default CampaignDetailAddresses
