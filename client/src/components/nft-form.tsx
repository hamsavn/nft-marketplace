import { Nft } from '@generated/graphql';
import { useAppSelector } from '@store/index';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from '@components/Button';
import { getFileUrl } from '@lib/get-file-url';

const DEFAULT_AVATAR = 'https://storage.googleapis.com/opensea-static/opensea-profile/18.png';

type FormikErrs = { [key: string]: string };

export type NftFormFields = {
  file: null | File;
  title: string;
  description: string;
  confirm: boolean;
};

interface Props {
  nft?: Nft;
  actionName: string;
  submitLoading: boolean;
  onSubmit: (values: NftFormFields) => void;
}

const NftForm: React.FC<Props> = ({ nft, actionName, submitLoading, onSubmit }) => {
  useEffect(() => {
    if (nft) {
      formik.setFieldValue('title', nft.title);
      formik.setFieldValue('description', nft.description);
    }
  }, [nft]);

  const formik = useFormik({
    initialValues: {
      file: null,
      title: '',
      description: '',
      confirm: false,
    } as NftFormFields,
    validate: (values) => {
      const errs: FormikErrs = {};

      if (!nft?.fileURL && !values.file) {
        errs.file = 'Image is requried';
      }

      if (values.file) {
        const fileSize = values.file.size / 1024 / 1024; // in MiB
        if (fileSize > 10) {
          errs.file = 'Max file size is 10MB';
        }
      }

      if (!values.title) {
        errs.title = 'Title is required';
      }

      if (!values.description) {
        errs.description = 'Description is required';
      }

      if (!values.confirm) {
        errs.confirm = 'Please accept terms and conditions';
      }

      return errs;
    },
    // submit form
    onSubmit,
  });

  const user = useAppSelector((state) => state.app.user);

  return (
    <section className="container">
      <div className="row">
        <div className="col-lg-7 offset-lg-1 mb-5">
          <form id="form-create-item" className="form-border" action="#">
            <div className="field-set">
              <h5>Upload file</h5>

              <div className="d-create-file">
                <p id="file_name">PNG, JPEG, GIF. Max 10MiB.</p>
                {formik.values.file && (
                  <div>
                    <div key="{index}">Image: {formik.values.file.name}</div>
                    <div>Size: {(formik.values.file.size / 1024 / 1024).toFixed(2)} Mib</div>
                  </div>
                )}
                <div className="browse mt-2">
                  <input type="button" id="get_file" className="btn-main" value="Browse" />
                  <input
                    id="upload_file"
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    onChange={(e) => {
                      formik.setFieldValue('file', e.currentTarget.files[0]);
                    }}
                  />
                </div>

                {formik.touched.file && formik.errors.file && (
                  <small className="text-danger">{formik.errors.file}</small>
                )}
              </div>

              <div className="spacer-single"></div>

              <h5>Title</h5>
              <input
                type="text"
                name="title"
                id="title"
                className="form-control"
                placeholder="e.g. 'Crypto Funk"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title && (
                <small className="text-danger">{formik.errors.title}</small>
              )}

              <div className="spacer-10"></div>

              <h5>Description</h5>
              <textarea
                data-autoresize
                name="description"
                id="description"
                className="form-control"
                placeholder="e.g. 'This is very limited item'"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <small className="text-danger">{formik.errors.description}</small>
              )}

              <div className="spacer-10"></div>

              <div>
                <input
                  type="checkbox"
                  name="confirm"
                  id="confirm"
                  checked={formik.values.confirm}
                  onChange={(e) => {
                    formik.setFieldValue('confirm', e.target.checked);
                  }}
                />
                <label htmlFor="confirm">
                  I declare that this is an original artwork. I understand that no plagiarism is
                  allowed, and that the artwork can be removed anytime if detected.
                </label>
              </div>
              {formik.touched.confirm && formik.errors.confirm && (
                <small className="text-danger">{formik.errors.confirm}</small>
              )}

              <div className="spacer-10"></div>

              <Button onClick={formik.submitForm} loading={submitLoading}>
                {actionName}
              </Button>
            </div>
          </form>
        </div>

        <div className="col-lg-3 col-sm-6 col-xs-12">
          <h5>Preview item</h5>
          <div className="nft__item m-0" style={{ minHeight: '200px' }}>
            {user && (
              <>
                <div className="author_list_pp">
                  <span>
                    <img className="lazy" src={getFileUrl(user.profileImage)} alt="" />
                    <i className="fa fa-check"></i>
                  </span>
                </div>
              </>
            )}

            {nft && (
              <>
                {formik.values.file ? (
                  <div
                    className="nft__item_wrap"
                    onClick={() => formik.setFieldValue('file', null)}
                    title="Remove this file"
                  >
                    <span>
                      <img id="get_file_2" src={URL.createObjectURL(formik.values.file)} alt="" />
                    </span>
                  </div>
                ) : (
                  <div className="nft__item_wrap" title="Remove this file">
                    <span>
                      <img id="get_file_2" src={getFileUrl(nft.fileURL)} alt="" />
                    </span>
                  </div>
                )}
              </>
            )}

            {!nft && (
              <div
                className="nft__item_wrap"
                onClick={() => formik.setFieldValue('file', null)}
                title="Remove this file"
              >
                <span>
                  {formik.values.file && (
                    <img id="get_file_2" src={URL.createObjectURL(formik.values.file)} alt="" />
                  )}
                </span>
              </div>
            )}

            <div className="nft__item_info">
              {formik.values.title && (
                <>
                  <span style={{ marginTop: 10, display: 'block' }}>
                    <h4>{formik.values.title}</h4>
                  </span>
                </>
              )}

              {formik.values.description && (
                <>
                  <div
                    className="nft__item_action"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    <span style={{ color: 'unset' }}>{formik.values.description}</span>
                  </div>
                </>
              )}

              <div className="spacer-30"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NftForm;
