import {ChangeEvent, Fragment, MouseEvent, useState} from 'react';
import type {FC} from 'react';
import numeral from 'numeral';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import {Image as ImageIcon} from '../../../icons/image';
import {Scrollbar} from '../../scrollbar';
import {Zone} from "../../../types/zone";
import {Video} from "../../../types/video";

interface ProductListTableProps {
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  page: number;
  products: Video[];
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
              <TableCell width="25%">
                视频Id
              </TableCell>
              <TableCell>
                视频名称
              </TableCell>
              <TableCell>
                视频url
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              return (
                <Fragment key={product.id}>
                  <TableRow
                    onClick={() => {
                      router.push(`/dashboard/videos/${product.id}?t=${new Date().getTime()}`);
                    }}
                    hover
                    key={product.id}
                  >
                    <TableCell
                      padding="checkbox"
                      width="25%"
                    >
                      {product.id}
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
                            ml: 2
                          }}
                        >
                          <Typography variant="subtitle2">
                            {product.file.name}
                          </Typography>

                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textSecondary"
                        variant="body2"
                      >
                        {product.file.url}
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
