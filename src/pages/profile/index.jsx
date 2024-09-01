import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  DELETE_PROFILE_IMAGE_ROUTE,
  HOST,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { setUserInfo } from "@/store/reducers/userSlice";
import { toast } from "sonner";

const Profile = () => {
  const userInfo = useSelector((state) => state.userSlice.userInfo ?? {});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#a223a0");
  const fileInputRef = useRef(null);

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup your profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile-image", file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
        withCredentials: true,
      });
      if (response.data.image && response.status === 200) {
        dispatch(setUserInfo({ ...userInfo, image: response.data.image }));
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = async () => {
    const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
      withCredentials: true,
    });
    if (response && response.status === 200) {
      dispatch(setUserInfo({ ...userInfo, image: null }));
      toast.success("Image removed successfully");
      setImage(null);
    }
  };

  const saveChanges = async () => {
    try {
      const data = {
        firstName: firstName,
        lastName: lastName,
      };
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE, data, {
        withCredentials: true,
      });
      if (response && response.status === 200) {
        dispatch(setUserInfo({ ...response?.data }));
        navigate("/chat");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (Boolean(userInfo?.profileSetup)) {
      setFirstName(userInfo?.firstName);
      setLastName(userInfo?.lastName);
    }
    if (userInfo.image) {
      setImage(`${HOST}/${userInfo.image}`);
    }
  }, [userInfo]);

  return (
    <>
      <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
          <div>
            <IoArrowBack
              className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
              onClick={handleNavigate}
            ></IoArrowBack>
          </div>
          <div className="grid grid-cols-2">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => {
                setHovered(true);
              }}
              onMouseLeave={() => {
                setHovered(false);
              }}
            >
              <Avatar className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className=" object-cover w-full h-full bg-black"
                  />
                ) : (
                  <div
                    className={`uppercase h-32 w-32 md:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full`}
                    style={{ backgroundColor: selectedColor, color: "#fff" }}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo?.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div
                  className=" absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                  onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {image ? (
                    <FaTrash className="text-3xl text-white cursor-pointer" />
                  ) : (
                    <FaPlus className="text-3xl text-white cursor-pointer" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className=" hidden"
                onChange={handleImageChange}
                name="profile-image"
                accept=".png,.jpg,.jpeg,svg,.webp"
              />
            </div>
            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 items-center justify-center text-white">
              <div className="w-full">
                <Input
                  placeholder="Email"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="First name"
                  type="text"
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  value={firstName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full">
                <Input
                  placeholder="Last name"
                  type="text"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  value={lastName}
                  className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div className="w-full px-2">
          <Button
            className={`h-16 w-full bg-purple-700 transition-all duration-300 ${
              firstName && lastName
                ? "hover:bg-purple-900"
                : "cursor-not-allowed"
            }`}
            onClick={saveChanges}
            disabled={firstName && lastName ? false : true}
          >
            Save changes
          </Button>
        </div>
      </div>
    </>
  );
};

export default Profile;
