import type {FC} from 'react';
import {useCallback, useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {FileDropzone} from '../../file-dropzone';
import uploadApi from "../../../utils/uploadApi";
import {useLazyQuery, useMutation} from "@apollo/client";
import {ADD_VIDEO, DELETE_VIDEO, UPDATE_VIDEO, VIDEO} from "../../../gql";


export const ProductCreateForm: FC = (props) => {
    const router = useRouter();
    const [files, setFiles] = useState<any[]>([]);
    const [queryVideo] = useLazyQuery(VIDEO);
    const [loaded, setLoaded] = useState(false);
    const id = router.query.id;
    const [handleAddVideo] = useMutation(ADD_VIDEO);
    const [handleUpdateVideo] = useMutation(UPDATE_VIDEO);
    const [handleDeleteVideo] = useMutation(DELETE_VIDEO);

    const formik = useFormik({
      initialValues: {
        submit: null
      },
      validationSchema: Yup.object({}),
      onSubmit: async (values, helpers): Promise<void> => {
        try {
          if (files.length === 0) {
            toast.error('请上传视频');
            return;
          }
          const finalFiles = files.map(({md5FileName, name, url, size}) => {
            return {md5FileName, name, url, size}
          });
          if (id) {
            await handleUpdateVideo({
              variables: {
                id: Number(id),
                file: {
                  ...finalFiles[0]
                }
              }
            })
          } else {
            await handleAddVideo({
              variables: {
                file: {
                  ...finalFiles[0]
                }
              }

            })
          }
          toast.success('Product created!');
          router.push('/dashboard/videos').catch(console.error);
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
        queryVideo({
          variables: {
            id: Number(id)
          }
        }).then((response) => {
          const {
            file,
          } = response.data.video.body
          setFiles([file])
          setLoaded(true)
        })
      }
    }, [formik.values, id, loaded, queryVideo])
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
    const handleDeletePostClick = useCallback(async () => {
      await handleDeleteVideo({
        variables: {
          id: Number(id),
        }
      })
      toast.success('删除成功');
      router.push(`/dashboard/videos`).catch(console.error);
    }, [handleDeleteVideo, id, router])

    return (
      <form
        onSubmit={formik.handleSubmit}
        {...props}
      >
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
                  视频
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{mt: 1}}
                >
                  请上传视频
                </Typography>
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <FileDropzone
                  accept={{
                    'video/*': []
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
          {
            id && <Button
							color="error"
							sx={{
                m: 1,
                mr: 'auto'
              }}
							onClick={handleDeletePostClick}
						>
							删除
						</Button>
          }
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
