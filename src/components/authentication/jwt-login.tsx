import type {FC} from 'react';
import {useRouter} from 'next/router';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Alert, Box, Button, FormHelperText, TextField} from '@mui/material';
import {useAuth} from '../../hooks/use-auth';
import {useMounted} from '../../hooks/use-mounted';
import {gql, useLazyQuery, useMutation} from "@apollo/client";
import {useCallback, useRef} from "react";
import toast from "react-hot-toast";


const LOGIN = gql`
    query ($account:String!,$password:String!) {
        login(account:$account,password:$password){
            code,
            message,
            body{
                token
            }
        }
    }
`;




export const JWTLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const {login} = useAuth();
  const [handleLogin] = useLazyQuery(LOGIN);
  const formRef = useRef<HTMLFormElement>(null);
  const formik = useFormik({
    initialValues: {
      account: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      account: Yup
        .string()
        .min(1)
        .required('请输入账号'),
      password: Yup
        .string()
        .min(6, '请输入6位以上的密码')
        .required('请输入密码码')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        const {data} = await handleLogin({
          variables: {
            account: values.account,
            password: values.password
          }
        })
        if (data.login.code === 100) {
          await login(data.login.body.token);
        } else {
          helpers.setErrors({submit: data.login.message});
          return;
        }
        if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string | undefined) || '/dashboard';
          router.push(returnUrl).catch(console.error);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({success: false});
          helpers.setErrors({submit: err.message});
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <TextField
        autoFocus
        error={Boolean(formik.touched.account && formik.errors.account)}
        fullWidth
        helperText={formik.touched.account && formik.errors.account}
        label="账号"
        margin="normal"
        name="account"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="tel"
        value={formik.values.account}
      />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <TextField
          error={Boolean(formik.touched.password && formik.errors.password)}
          fullWidth
          helperText={formik.touched.password && formik.errors.password}
          label="密码"
          margin="normal"
          name="password"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="password"
          value={formik.values.password}
        />
      </Box>

      {formik.errors.submit && (
        <Box sx={{mt: 3}}>
          <FormHelperText error>
            {formik.errors.submit}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{mt: 2}}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          登录
        </Button>
      </Box>
    </form>
  );
};
