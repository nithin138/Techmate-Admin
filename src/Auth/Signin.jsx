import React, { Fragment, useState, useEffect, useContext } from "react";
import { Col, Container, Form, FormGroup, Input, Label, Media, Row } from "reactstrap";
import { Btn, H4, Image, P } from "../AbstractElements";
import { EmailAddress, ForgotPassword, FullName, Password, RememberPassword, SignIn } from "../Constant";

import { useNavigate, useRevalidator } from "react-router-dom";
import man from "../assets/images/dashboard/profile.png";

import CustomizerContext from "../_helper/Customizer";
import OtherWay from "./OtherWay";
import { ToastContainer, toast } from "react-toastify";
import CubaIcon from '../../src/assets/images/logo/Techmate Logo.svg';
import axios from 'axios'
import { baseURL } from "../Services/api/baseURL";
import { AuthContext, AuthProvider, useAuthContext } from "../context/Auth";

const Signin = ({ selected }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const history = useNavigate();
  const [loginType, setLoginType] = useState('Admin')
  const { layoutURL } = useContext(CustomizerContext);
  const [value, setValue] = useState(localStorage.getItem("profileURL" || man));
  const [name, setName] = useState();
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([])

  useEffect(() => {
    localStorage.setItem("profileURL", man);
    localStorage.setItem("Name", name);
  }, [value, name]);




  const loginAuth = async (e) => {
    e.preventDefault();
    try {
      const obj = {
        email: email,
        password: password,
        role: selectedRole,

      }
      //console.log(obj,"inside")
      const endPoint = loginType === 'Admin' ? '/admin/login' : '/admin/support/login';
      const postuser = await axios.post(`${baseURL}/api${endPoint}`, obj)


      console.log(postuser)
      // const postuser = await axios.post(`${baseURL}/api/admin/login`, obj)
      //console.log(postuser,"clicked login")
      toast.success("Successfully logged in!..");
      const token = postuser.data.token;
      const full_Name = postuser.data?.user?.name
      setName(full_Name)
      localStorage.setItem("UserData", JSON.stringify(postuser.data.user));
      localStorage.setItem("token", JSON.stringify(token))
      localStorage.setItem("login", JSON.stringify(true));
      localStorage.setItem("authenticated", JSON.stringify(true));
      localStorage.setItem("role_name", JSON.stringify(postuser?.data?.user?.role))
            localStorage.setItem("features", JSON.stringify(postuser?.data?.user?.supportRole?.features))

      history(`/dashboard`);

    } catch (error) {
      toast.error("You enter wrong password or username!..");
      //console.log(error)

    }
    // if (email === "test@gmail.com" && password === "test123") {
    //   localStorage.setItem("login", JSON.stringify(true));

    // }
    // history(`${process.env.PUBLIC_URL}/pages/mainpages/Dashboard/index/:layout`);
    // toast.success("Successfully logged in!..");
    // } else {
    //   toast.error("You enter wrong password or username!..");
    // }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/roles`);
        // console.log(response)
        setRoles(response?.data)
      }
      catch (error) {
        console.log(error)
      }
    }
    fetchRoles();
  }, [])

  return (
    <Fragment>
      <Container fluid={true} className="p-0 login-page">
        <Row>
          <Col xs="12">
            <div className="login-card">
              <div className="login-main login-tab">
                <Form className="theme-form">

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                    <Image attrImage={{ className: 'img-fluid d-inline w-60', src: `${CubaIcon}`, alt: '' }} />
                  </div>
                  <div className="switches-container">
                    <input
                      type="radio"
                      id="switchAdmin"
                      name="switchPlan"
                      value="Admin"
                      checked={loginType === 'Admin'}
                      onChange={() => setLoginType('Admin')}
                    />
                    <input
                      type="radio"
                      id="switchPartner"
                      name="switchPlan"
                      value="Partner"
                      checked={loginType === 'Partner'}
                      onChange={() => setLoginType('Partner')}
                    />
                    <label htmlFor="switchAdmin">Login as Admin</label>
                    <label htmlFor="switchPartner">Login as Support</label>
                    <div className="switch-wrapper">
                      <div className="switch">
                        <div>Login as Admin</div>
                        <div>Login as Support</div>
                      </div>
                    </div>
                  </div>
                  {/* </div> */}
                  <FormGroup>
                    <Label className="col-form-label">{EmailAddress}</Label>
                    <Input className="form-control" placeholder="text@gmail.com" type="email" onChange={(e) => setEmail(e.target.value)} value={email} />
                  </FormGroup>
                  {/* {loginType !== 'Admin' &&
                    <FormGroup>
                      <Label className="col-form-label">Select Role</Label>
                      <Input
                        type="select"
                        className="form-control"
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                      >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                          <option key={role._id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>} */}
                  <FormGroup className="position-relative">
                    <Label className="col-form-label">{Password}</Label>
                    <div className="position-relative">
                      <Input className="form-control" placeholder="************" type={togglePassword ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} value={password} />
                      <div className="show-hide" onClick={() => setTogglePassword(!togglePassword)}>
                        <span className={togglePassword ? "" : "show"}></span>
                      </div>
                    </div>
                  </FormGroup>


                  <div className="position-relative form-group mb-0">
                    <div className="checkbox">
                      <Input id="checkbox1" type="checkbox" />
                      <Label className="text-muted" for="checkbox1">
                        {RememberPassword}
                      </Label>
                    </div>
                    <a className="link" href="#javascript">
                      {ForgotPassword}
                    </a>
                    <button className="d-block w-100 mt-2 py-2.5 rounded-xl text-white bg-[#2F6FED]" onClick={(e) => loginAuth(e)}>{SignIn}</button>
                  </div>
                  {/* <div className="flex justify-center items-center mt-2">
                    <p>Don't have account?<span className="text-[#d3178a]">Create Account</span></p>
                  </div> */}
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Container >
      <ToastContainer />
    </Fragment >
  );
};

export default Signin;
