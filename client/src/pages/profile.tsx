import React, { useEffect, useState, useRef } from 'react';
import withPrivateRoute from '../lib/withPrivateRoute';
import { Form, Formik, Field, useFormik } from 'formik';
import { RepositoryFactory } from '@repositories/RepositoryFactory';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@store/index';
import { Button } from '@components/Button';
import { getFileUrl } from '@lib/get-file-url';
import { fetchUser } from '@store/index';

function Profile() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const profileImgInput = useRef(null);
  const user = useAppSelector((state) => state.app.user);

  useEffect(() => {
    if (user) {
      formik.setFieldValue('email', user.email);
      formik.setFieldValue('bio', user.bio);
      formik.setFieldValue('socialLink', user.socialLink);
      formik.setFieldValue('userName', user.userName);
      formik.setFieldValue('profileBanner', user.profileBanner);
      formik.setFieldValue('twitterName', user.twitterName);
      formik.setFieldValue('instaName', user.instaName);

      setProfileImage(
        user.profileImage || 'https://storage.googleapis.com/opensea-static/opensea-profile/18.png',
      );
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      email: '',
      bio: '',
      socialLink: '',
      userName: '',
      profileImage: undefined,
      profileBanner: '',
      twitterName: '',
      instaName: '',
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);

        await RepositoryFactory.get('auth').updateUser({ ...formik.values });

        dispatch(fetchUser(user.address));

        toast.success('Your change has been saved');
      } catch (error) {
        const m = error.message;
        toast.error(m);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="greyscheme">
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Profile</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {user && (
        <section className="container">
          <div className="row">
            <div className="col-lg-7 offset-lg-1 mb-5">
              <form>
                <div className="field-set">
                  <h5>User name</h5>
                  <input
                    type="text"
                    name="userName"
                    id="userName"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                  />

                  <h5>Bio</h5>
                  <input
                    type="text"
                    name="bio"
                    id="bio"
                    className="form-control"
                    placeholder="Tell the world who you are!"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                  />

                  <h5>Email</h5>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />

                  <h5>
                    <i className="fa fa-link" /> Your site
                  </h5>
                  <input
                    type="text"
                    name="socialLink"
                    id="socialLink"
                    className="form-control"
                    placeholder="Enter your link"
                    value={formik.values.socialLink}
                    onChange={formik.handleChange}
                  />

                  <h5>
                    <i className="fa fa-twitter" /> Twitter username
                  </h5>
                  <input
                    type="text"
                    name="twitterName"
                    id="twitterName"
                    className="form-control"
                    placeholder="Enter Twitter user name"
                    value={formik.values.twitterName}
                    onChange={formik.handleChange}
                  />

                  <h5>
                    <i className="fa fa-instagram" /> Instagram username
                  </h5>
                  <input
                    type="text"
                    name="instaName"
                    id="instaName"
                    className="form-control"
                    placeholder="Enter Instagram user name"
                    value={formik.values.instaName}
                    onChange={formik.handleChange}
                  />

                  <div className="spacer-10"></div>
                  <Button loading={loading} onClick={formik.submitForm}>
                    Update Profile
                  </Button>
                </div>
              </form>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12" style={{ paddingLeft: 30 }}>
              <h5>Profile image </h5>
              <img
                src={getFileUrl(profileImage)}
                id="click_profile_img"
                className="d-profile-img-edit img-fluid"
                alt=""
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  (profileImgInput.current as any)?.click();
                }}
              />
              <input
                ref={profileImgInput}
                style={{ display: 'none' }}
                name="profile_image"
                type="file"
                id="upload_profile_img"
                accept="image/*"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  formik.setFieldValue('profileImage', file);
                  setProfileImage(URL.createObjectURL(file));
                }}
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default withPrivateRoute(Profile);
