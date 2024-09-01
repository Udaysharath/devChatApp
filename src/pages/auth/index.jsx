import React, { useState } from "react";
import victoryIcon from "../../assets/victory.svg";
import backGroundIcon from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/store/reducers/userSlice";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateSignUp = () => {
    if (!email.length) {
      toast.error("Email required");
      return false;
    }
    if (!password.length) {
      toast.error("Password required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password Doesn't match");
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email required");
      return false;
    }
    if (!password.length) {
      toast.error("Password required");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (validateSignUp()) {
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 201) {
          dispatch(setUserInfo(res.data.user));
          navigate("/profile");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const res = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 202 && res.data.user.id) {
          dispatch(setUserInfo(res.data.user));
          if (Boolean(res.data.user.profileSetup)) {
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };
  return (
    <div className="h-[90vh] w-full flex items-center justify-center">
      <div className="border w-[80vw] shadow-lg h-[80vh] p-6 rounded-lg flex flex-row justify-center items-center">
        <div>
          <div className="flex flex-row items-center justify-center">
            <h1 className="text-2xl font-bold mb-4">Welcome</h1>
            <img
              src={victoryIcon}
              alt="Welcome"
              className="w-[50px] h-[50px] object-cover mb-4"
            />
          </div>
          <p className="flex justify-center items-center">
            Fill in the details to get started with the best chat app!
          </p>
          <div className=" flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="w-full">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className=" rounded-full p-6" onClick={handleLogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent className="flex flex-col gap-5" value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  className="rounded-full p-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  className="rounded-full p-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  className="rounded-full p-6"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className=" rounded-full p-6" onClick={handleSignUp}>
                  Signup
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className=" hidden xl:flex items-center justify-center">
          <img src={backGroundIcon} alt="bg-img" className="max-h-[400px]" />
        </div>
      </div>
    </div>
  );
};

export default Auth;
