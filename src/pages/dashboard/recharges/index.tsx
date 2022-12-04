import {ChangeEvent, MouseEvent, useCallback, useEffect, useMemo, useState} from 'react';
import type {NextPage} from 'next';
import Head from 'next/head';
import {Box, Card, Container, Grid, Typography} from '@mui/material';
import {AuthGuard} from '../../../components/authentication/auth-guard';
import {DashboardLayout} from '../../../components/dashboard/dashboard-layout';
import type {Filters} from '../../../components/dashboard/recharge/product-list-filters';
import {ProjectListFilters} from '../../../components/dashboard/recharge/product-list-filters';
import {ProductListTable} from '../../../components/dashboard/recharge/product-list-table';
import {gtm} from '../../../lib/gtm';
import {useQuery} from "@apollo/client";
import {RECHARGE_LIST} from "../../../gql";


const ProductList: NextPage = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: ['-1']
  });
  const {data,refetch } = useQuery(RECHARGE_LIST, {
    variables: {
      status: Number(filters.status[0])
    }
  });

  useEffect(() => {
    gtm.push({event: 'page_view'});
  }, []);


  const handleRefetch = useCallback(()=>{
    refetch();
  },[refetch])



  const handleFiltersChange = (filters: Filters): void => {
    setFilters(filters);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, newPage: number): void => {
    setPage(newPage);
  };


  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };


  const rechargeList = useMemo(() => {
    return data?.rechargeList?.edges.map(({node}: any) => {
      return {...node}
    }) || []
  }, [data?.rechargeList?.edges])

  return (
    <>
      <Head>
        <title>
          Dashboard: Product List | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{mb: 4}}>
            <Grid
              container
              justifyContent="space-between"
              spacing={3}
            >
              <Grid item>
                <Typography variant="h4">
                  充值审批
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Card>
            <ProjectListFilters onChange={handleFiltersChange} />
            <ProductListTable
              reload={handleRefetch}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              products={rechargeList}
              productsCount={rechargeList.length}
              rowsPerPage={rowsPerPage}
            />
          </Card>
        </Container>
      </Box>
    </>
  );
};

ProductList.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default ProductList;
