import type {FC} from 'react';
import {ChangeEvent, Fragment, MouseEvent, useMemo, useState} from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import {ChevronDown as ChevronDownIcon} from '../../../icons/chevron-down';
import {ChevronRight as ChevronRightIcon} from '../../../icons/chevron-right';
import {Scrollbar} from '../../scrollbar';
import {SeverityPill} from '../../severity-pill';
import {RechargeRecord} from "../../../types/recharge";
import {ProductApproval} from "./product-approval";
import {useQuery} from "@apollo/client";
import {PAYMENTS} from "../../../gql";

const STATUS_MAP: any = {
  0: {
    color: 'info',
    text: '待审批'
  },
  1: {
    color: 'success',
    text: '通过'
  },
  2: {
    color: 'error',
    text: '拒绝'
  }
}


interface ProductListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  reload: ()=>void;
  page: number;
  products: RechargeRecord[];
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
    reload,
    ...other
  } = props;
  const [openProduct, setOpenProduct] = useState<number | null>(null);
  const { data: paymentsData } = useQuery(PAYMENTS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const payments = paymentsData?.payments || [];

  const handleOpenProduct = (productId: number): void => {
    setOpenProduct((prevValue) => (prevValue === +productId ? null : productId));
  };


  const paymentMap = useMemo(() => {
    const map = {};
    // @ts-ignore
    payments.forEach((payment:any) => (map[payment.type] = payment));
    console.log(map);
    return map;
  }, [payments]);

  return (
    <div {...other}>
      <Scrollbar>
        <Table sx={{minWidth: 1200}}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell width="25%">
                用户名
              </TableCell>
              <TableCell>
                邮箱
              </TableCell>
              <TableCell>
                充值方式
              </TableCell>
              <TableCell width="25%">
                交易hash/订单号
              </TableCell>
              <TableCell>
                余额
              </TableCell>
              <TableCell>
                充值金额
              </TableCell>
              <TableCell>
                特殊充值金额
              </TableCell>
              <TableCell>
                状态
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              const open = product.id === openProduct;

              // @ts-ignore
              return (
                <Fragment key={product.id}>
                  <TableRow
                    hover
                    key={product.id}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(open && {
                          position: 'relative',
                          '&:after': {
                            position: 'absolute',
                            content: '" "',
                            top: 0,
                            left: 0,
                            backgroundColor: 'primary.main',
                            width: 3,
                            height: 'calc(100% + 1px)'
                          }
                        })
                      }}
                      width="25%"
                    >
                      <IconButton onClick={() => handleOpenProduct(product.id)}>
                        {
                          open
                            ? <ChevronDownIcon fontSize="small" />
                            : <ChevronRightIcon fontSize="small" />
                        }
                      </IconButton>
                    </TableCell>
                    <TableCell width="25%">
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex'
                        }}
                      >
                        <Box
                          sx={{
                            cursor: 'pointer',
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product?.user?.account}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell width="25%">
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {product.user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {paymentMap[product.type]?.name}
                    </TableCell>
                    <TableCell>
                      {product.transactionHash}
                    </TableCell>
                    <TableCell>
                      {numeral(product.user.balance).format(`${product.user.balance}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {numeral(product.amount).format(`${product.amount}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      {numeral(product.specialAmount).format(`${product.specialAmount}0,0.00`)}
                    </TableCell>
                    <TableCell>
                      <SeverityPill color={STATUS_MAP[product.status].color}>
                        {STATUS_MAP[product.status].text}
                      </SeverityPill>
                    </TableCell>
                  </TableRow>
                  {open && (
                    <ProductApproval handleOpenProduct={() => {
                      setOpenProduct(null)
                    }}
                                     product={product}
                                     reload={reload}
                    />
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={productsCount}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
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
