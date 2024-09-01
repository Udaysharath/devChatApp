import React, { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { HOST, LOGOUT_ROUTE } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaUserEdit } from "react-icons/fa";
import { IoLogOut, IoPowerSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { setUserInfo } from "@/store/reducers/userSlice";

const ProfileInfo = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedColor, setSelectedColor] = useState("#a223a0");

  const logOut = async () => {
    try {
      const response = await apiClient.post(LOGOUT_ROUTE, "", {
        withCredentials: true,
      });
      if (response && response.status === 200) {
        navigate("/auth");
        dispatch(setUserInfo(null));
      }
    } catch (error) {}
  };
  return (
    <div className=" absolute bottom-0 h-16 flex items-center justify-center px-2 w-full bg-[#2a2b33] gap-2 ">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="w-12 h-12 rounded-full overflow-hidden">
            {userInfo.image ? (
              <AvatarImage
                src={`${HOST}/${userInfo.image}`}
                alt="profile"
                className=" object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase h-12 w-12 border-[1px] flex items-center justify-center rounded-full`}
                style={{ backgroundColor: selectedColor, color: "#fff" }}
              >
                {userInfo?.firstName
                  ? userInfo?.firstName.split("").shift()
                  : userInfo?.email.split("").shift()}
              </div>
            )}
          </Avatar>
        </div>
        <div className="">
          {userInfo.firstName && userInfo.lastName
            ? `${userInfo.firstName} ${userInfo.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FaUserEdit
                className="text-purple-500 text-xl font-medium"
                onClick={() => {
                  navigate("/profile");
                }}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium"
                onClick={logOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              Log out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
