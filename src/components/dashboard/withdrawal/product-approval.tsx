import {
  Box,
  Button,
  CardContent,
  Divider,
  Grid,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import {RechargeRecord} from "../../../types/recharge";
import {toast} from "react-hot-toast";
import {useMutation} from "@apollo/client";
import {WITHDRAWAL_APPROVAL} from "../../../gql";
import {useState} from "react";

export const ProductApproval = ({
                                  product,
                                  handleOpenProduct,
                                  reload,
                                }: {
  product: RechargeRecord,
  handleOpenProduct: () => void,
  reload: () => void
}) => {
  const [handleApproval] = useMutation(WITHDRAWAL_APPROVAL)
  const [amount, setAmount] = useState(product.amount)
  const [transactionHash, setTransactionHash] = useState(product.transactionHash)
  const handleResolveProduct = (): void => {
    handleOpenProduct();
    if(!handleResolveProduct){
      toast.error('请填写交易Hash')
    }
    handleApproval({
      variables: {
        amount: Number(amount),
        id: product.id,
        status: 1,
        transactionHash
      }
    }).then((response) => {
      if (response.data.withdrawalApproval.code === 100) {
        toast.success('通过');
        reload();
      }else{
        toast.error(response.data.withdrawalApproval.message);
      }
    })
  };

  const handleAmountChange = (ev: { target: { value: any; }; }) => {
    const value = ev.target.value;
    setAmount(value)
  }

  const handleTransactionHashChange = (ev: { target: { value: any; }; }) => {
    const value = ev.target.value;
    setTransactionHash(value)
  }

  const handleCancelEdit = (): void => {
    handleOpenProduct();
  };

  const handleRejectProduct = (): void => {
    handleApproval({
      variables: {
        amount,
        id: product.id,
        status: 2
      }
    }).then((response) => {
      if (response.data.withdrawalApproval.code === 100) {
        toast.error('拒绝');
        reload();
      }else{
        toast.error(response.data.withdrawalApproval.message);
      }
    })

  };
  return <TableRow>
    <TableCell
      colSpan={7}
      sx={{
        p: 0,
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
      }}
    >
      <CardContent>
        <Grid
        >
          <Grid
            item
          >
            <Typography variant="h6">
              信息
            </Typography>
            <Divider sx={{my: 2}} />
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  onChange={handleAmountChange}
                  defaultValue={product.amount}
                  disabled={true}
                  fullWidth
                  type="number"
                  label="提现金额"
                  name="name"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  onChange={handleTransactionHashChange}
                  defaultValue={product.transactionHash}
                  disabled={!!product.transactionHash}
                  fullWidth
                  type="text"
                  label="交易hash"
                  name="transactionHash"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      {
        product.status === 0 &&  <Box
					sx={{
            display: 'flex',
            flexWrap: 'wrap',
            px: 2,
            py: 1
          }}
				>
					<Button
						onClick={handleResolveProduct}
						sx={{m: 1}}
						type="submit"
						variant="contained"
					>
						通过
					</Button>
					<Button
						onClick={handleCancelEdit}
						sx={{m: 1}}
						variant="outlined"
					>
						取消
					</Button>
					<Button
						onClick={handleRejectProduct}
						color="error"
						sx={{
              m: 1,
              ml: 'auto'
            }}
					>
						拒绝
					</Button>
				</Box>
      }
    </TableCell>
  </TableRow>
}
