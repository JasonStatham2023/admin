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
import {RECHARGE_APPROVAL} from "../../../gql";
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
  const [handleApproval] = useMutation(RECHARGE_APPROVAL)
  const [amount, setAmount] = useState(product.amount)
  const handleResolveProduct = (): void => {
    handleOpenProduct();
    handleApproval({
      variables: {
        amount: Number(amount),
        id: product.id,
        status: 1
      }
    }).then((response) => {
      if (response.data.rechargeApproval.code === 100) {
        toast.success('通过');
        reload();
      } else {
        toast.error(response.data.rechargeApproval.message);
      }
    })
  };

  const handleAmountChange = (ev: { target: { value: any; }; }) => {
    const value = ev.target.value;
    setAmount(value)
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
      if (response.data.rechargeApproval.code === 100) {
        toast.error('拒绝');
        reload();
      } else {
        toast.error(response.data.rechargeApproval.message);
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
              充值金额
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
                  fullWidth
                  type="number"
                  label="充值金额"
                  name="name"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      {
        product.status === 0 && <Box
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
