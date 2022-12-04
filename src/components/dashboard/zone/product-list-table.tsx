import type {FC} from 'react';
import {ChangeEvent, Fragment, MouseEvent} from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {Box, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@mui/material';
import {Image as ImageIcon} from '../../../icons/image';
import {Scrollbar} from '../../scrollbar';
import {Zone} from "../../../types/zone";

interface ProductListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  products: Zone[];
  productsCount: number;
  rowsPerPage: number;
}

export const ProductListTable: FC<ProductListTableProps> = (props) => {
  const {
    onPageChange,
    onRowsPerPageChange,
    page,
    products,
    productsCount,
    rowsPerPage,
    ...other
  } = props;
  const router = useRouter();

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{minWidth: 1200}}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell width="25%">
                专区名称
              </TableCell>
              <TableCell>
                冻结概率
              </TableCell>
              <TableCell>
                单价
              </TableCell>
              <TableCell>
                分润
              </TableCell>
              <TableCell>
                任务数
              </TableCell>
              <TableCell>
                奖励
              </TableCell>
              <TableCell>
                10次奖励金币数
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              return (
                <Fragment key={product.id}>
                  <TableRow
                    onClick={() => {
                      router.push(`/dashboard/zones/${product.id}?t=${new Date().getTime()}`);
                    }}
                    hover
                    key={product.id}
                  >
                    <TableCell
                      padding="checkbox"
                      width="25%"
                    >
                    </TableCell>
                    <TableCell width="25%">
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        {
                          product.cover
                            ? (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  backgroundColor: 'background.default',
                                  backgroundImage: `url(${product.cover?.url || ''})`,
                                  backgroundPosition: 'center',
                                  backgroundSize: 'cover',
                                  borderRadius: 1,
                                  display: 'flex',
                                  height: 80,
                                  justifyContent: 'center',
                                  overflow: 'hidden',
                                  width: 80
                                }}
                              />
                            )
                            : (
                              <Box
                                sx={{
                                  alignItems: 'center',
                                  backgroundColor: 'background.default',
                                  borderRadius: 1,
                                  display: 'flex',
                                  height: 80,
                                  justifyContent: 'center',
                                  width: 80
                                }}
                              >
                                <ImageIcon fontSize="small" />
                              </Box>
                            )
                        }
                        <Box
                          sx={{
                            cursor: 'pointer',
                            ml: 2
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product.title}
                          </Typography>

                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {product.probability}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {numeral(product.unitPrice).format(`${product.unitPrice}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {numeral(product.shareProfit).format(`${product.shareProfit}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {product.takes}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {numeral(product.award).format(`${product.award}0,0.00`)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {product.gold}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
    </div>
  );
};

ProductListTable.propTypes = {
  products: PropTypes.array.isRequired,
  productsCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};
