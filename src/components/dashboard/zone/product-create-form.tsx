import type {FC} from 'react';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Box, Button, Card, CardContent, Grid, TextField, Typography} from '@mui/material';
import {FileDropzone} from '../../file-dropzone';
import uploadApi from "../../../utils/uploadApi";
import {useLazyQuery, useMutation} from "@apollo/client";
import {ADD_ZONE, UPDATE_ZONE, ZONE} from "../../../gql";
import {styled} from "@mui/material/styles";

const TextWrap = styled('div')`
	textarea {
		white-space: pre-wrap;
	}
`


export const ProductCreateForm: FC = (props) => {
    const router = useRouter();
    const [files, setFiles] = useState<any[]>([]);
    const [handleAddZone] = useMutation(ADD_ZONE);
    const [handleUpdateZone] = useMutation(UPDATE_ZONE);
    const [queryZone, {data}] = useLazyQuery(ZONE);
    const [loaded, setLoaded] = useState(false);
    const id = router.query.id;

    const formik = useFormik({
      initialValues: {
        title: '',
        cover: '',
        probability: 10,
        unitPrice: 0,
        shareProfit: 0,
        takes: 10,
        introduce: '',
        award: 10,
        gold: 10,
        maxFreezesNum: 10,
        submit: null
      },
      validationSchema: Yup.object({
        title: Yup.string().max(255).required('请输入标题'),
        cover: Yup.string().max(255),
        probability: Yup.number().max(100),
        unitPrice: Yup.number().max(999999),
        shareProfit: Yup.number().max(999999),
        takes: Yup.number().max(999999),
        introduce: Yup.string().required('请填写专区介绍'),
        award: Yup.string().max(255),
        gold: Yup.string().max(255),
        maxFreezesNum: Yup.number().max(1000),
        sku: Yup.string().max(255)
      }),
      onSubmit: async (values, helpers): Promise<void> => {
        try {
          if (files.length === 0) {
            toast.error('请上传专区封面');
            return;
          }
          if (values.introduce.length === 0) {
            toast.error('请填写专区介绍');
            return;
          }
          const finalFiles = files.map(({md5FileName, name, url, size}) => {
            return {md5FileName, name, url, size}
          });
          if (id) {
            await handleUpdateZone({
              variables: {
                id: Number(id),
                ...values,
                cover: {
                  ...finalFiles[0]
                }
              }
            })
          } else {
            await handleAddZone({
              variables: {
                ...values,
                cover: {
                  ...finalFiles[0]
                }
              }

            })
          }
          toast.success('Product created!');
          router.push('/dashboard/zones').catch(console.error);
        } catch
          (err) {
          console.error(err);
          toast.error('Something went wrong!');
          helpers.setStatus({success: false});
          helpers.setErrors({submit: err.message});
          helpers.setSubmitting(false);
        }
      }
    });
    useEffect(() => {
      if (id && !loaded) {
        queryZone({
          variables: {
            id: Number(id)
          }
        }).then((response) => {
          const {
            title,
            cover,
            probability,
            unitPrice,
            shareProfit,
            takes,
            introduce,
            award,
            gold,
            maxFreezesNum,
          } = response.data.zone.body
          formik.values.title = title;
          formik.values.probability = probability;
          formik.values.unitPrice = unitPrice;
          formik.values.shareProfit = shareProfit;
          formik.values.takes = takes;
          formik.values.introduce = introduce;
          formik.values.award = award;
          formik.values.gold = gold;
          formik.values.maxFreezesNum = maxFreezesNum;
          setFiles([cover])
          setLoaded(true)
        })
      }
    }, [formik.values, id, loaded, queryZone])
    const handleDrop = async (newFiles: any[]): Promise<void> => {
      const file = newFiles[0]
      const response = await uploadApi.post(file, () => {
      });
      if (response.data.code === 100) {
        setFiles([{
          md5FileName: '',
          name: file.name,
          url: '//www.ovb.life' + response.data.body.url,
          size: file.size, ...file
        }]);
      }
    };

    const handleRemove = (file: any): void => {
      setFiles((prevFiles) => prevFiles.filter((_file) => _file.path !== file.path));
    };

    const handleRemoveAll = (): void => {
      setFiles([]);
    };

    return (
      <form
        onSubmit={formik.handleSubmit}
        {...props}
      >
        <Card>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={4}
                xs={12}
              >
                <Typography variant="h6">
                  基础信息
                </Typography>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <TextField
                  error={Boolean(formik.touched.title && formik.errors.title)}
                  fullWidth
                  helperText={formik.touched.title && formik.errors.title}
                  label="标题"
                  name="title"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.title}
                />
                <Typography
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    mt: 3
                  }}
                  variant="subtitle2"
                >
                  专区介绍
                </Typography>
                <TextField
                  value={formik.values.introduce}
                  error={Boolean(formik.touched.introduce && formik.errors.introduce)}
                  defaultValue={""}
                  fullWidth
                  name="introduce"
                  label="Description"
                  multiline
                  onChange={formik.handleChange}
                  placeholder="请输入markdown 文本"
                  rows={30}
                  sx={{mt: 3, whiteSpace: 'pre-wrap'}}
                />
                <TextField
                  error={Boolean(formik.touched.probability && formik.errors.probability)}
                  fullWidth
                  label="概率"
                  name="probability"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.probability}
                />
                <TextField
                  error={Boolean(formik.touched.maxFreezesNum && formik.errors.maxFreezesNum)}
                  fullWidth
                  label="最大冻结次数"
                  name="maxFreezesNum"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.maxFreezesNum}
                />
                <TextField
                  error={Boolean(formik.touched.unitPrice && formik.errors.unitPrice)}
                  fullWidth
                  label="单价"
                  name="unitPrice"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.unitPrice}
                />
                <TextField
                  error={Boolean(formik.touched.shareProfit && formik.errors.shareProfit)}
                  fullWidth
                  label="分润"
                  name="shareProfit"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.shareProfit}
                />
                <TextField
                  error={Boolean(formik.touched.takes && formik.errors.takes)}
                  fullWidth
                  label="单日可执行的任务总数"
                  name="takes"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.takes}
                />
                <TextField
                  error={Boolean(formik.touched.award && formik.errors.award)}
                  fullWidth
                  label="奖金（反现）"
                  name="award"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.award}
                />
                <TextField
                  error={Boolean(formik.touched.gold && formik.errors.gold)}
                  fullWidth
                  label="10次冻结随机给的金币范围"
                  name="gold"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  sx={{mt: 2}}
                  type="number"
                  value={formik.values.gold}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card sx={{mt: 3}}>
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={4}
                xs={12}
              >
                <Typography variant="h6">
                  封面图片
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{mt: 1}}
                >
                  请上传一张专区封面图片
                </Typography>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <FileDropzone
                  accept={{
                    'image/*': []
                  }}
                  files={files}
                  onDrop={handleDrop}
                  onRemove={handleRemove}
                  onRemoveAll={handleRemoveAll}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            mx: -1,
            mb: -1,
            mt: 3
          }}
        >
          <Button
            sx={{m: 1}}
            variant="outlined"
            onClick={() => router.back()}
          >
            取消
          </Button>
          <Button
            sx={{m: 1}}
            type="submit"
            variant="contained"
          >
            {id ? '更新' : '创建'}
          </Button>
        </Box>
      </form>
    );
  }
;
