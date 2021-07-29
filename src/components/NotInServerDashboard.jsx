// import { ArrowRightIcon, EmailIcon } from "@chakra-ui/icons";
// import { Button, Input, InputGroup, Stack, Text, useToast } from "@chakra-ui/react";
// import axios from "axios";
// import { useState } from "react";
import * as swot from "swot-node";

import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  Flex,
  useToast,
  FormControl,
  FormLabel,
  FormHelperText,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";

import axios from "axios";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";

export default function NotInServerDashboard(user) {
  // const [isEmail, setIsEmail] = useState("")

  const [loadingPage, setLoadingPage] = useState(true);

  const [isInvited, setIsInvited] = useState(false);

  const [buttonColor, setButtonColor] = useState("blue");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState("");
  const [email, setEmail] = useState("");
  const [IsAcademic, setIsAcademic] = useState(false);

  const [isOTPSent, setIsOTPSent] = useState(false);

  const [OTP, setOTP] = useState(null);
  const [IsValidOTP, setIsValidOTP] = useState(false);
  const [isLoadingOTPButton, setisLoadingOTPButton] = useState(false);
  const [OTPSubmitbuttonColor, setOTPSubmitbuttonColor] = useState("blue");

  const [redirect, setRedirect] = useState(false);

  const toast = useToast();

  async function handleEmail(event) {
    setEmail(event.target.value);
    let isAcademicEmail = await swot.isAcademic(event.target.value);
    if (isAcademicEmail) {
      setIsAcademic(true);
    } else {
      setIsAcademic(false);
    }
    event.preventDefault();
  }

  async function handleForm(e) {
    e.preventDefault();
    if (isSubmitted === email) {
      return toast({
        title: "OTP has been already sent to Email",
        description: "OTP has been already sent to Email",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    if (!IsAcademic) {
      return toast({
        title: "Email is invalid",
        description: "The value entered is not a valid email.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(true);
    await axios
      .post("/api/send-email", {
        email: email,
        inviteCode: window.localStorage.getItem("inviteCode"),
      })
      .then((response) => {
        setIsSubmitted(email);
        setIsOTPSent(true);
        toast({
          title: "OTP Sent",
          description: "OTP has been submitted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setButtonColor("green");
      })
      .catch((err) => {
        toast({
          title: "An Error occured",
          description:
            "We could not process the entered Email. Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        console.error(err);
        setButtonColor("red");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  async function handleOTP(event) {
    let v = event.target.value;
    setOTP(event.target.value);
    let validOTPinput = v.toString().length === 6;
    if (validOTPinput) {
      setIsValidOTP(true);
    } else {
      setIsValidOTP(false);
    }
    event.preventDefault();
  }

  async function handleFormOTP(e) {
    e.preventDefault();
    setisLoadingOTPButton(true);
    await axios
      .post("/api/join-server", { OTP: OTP })
      .then((response) => {
        toast({
          title: "OTP Verified",
          description: "OTP has been submitted and verified.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setOTPSubmitbuttonColor("green");
        // redirect
        setRedirect(true);
      })
      .catch((err) => {
        toast({
          title: "An Error occured",
          description:
            "We could not process the entered OTP. Please try again later.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        console.error(err);
        setButtonColor("red");
      })
      .finally(() => {
        setisLoadingOTPButton(false);
      });
  }

  const inviteCode = window.localStorage.getItem("inviteCode");
  useEffect(() => {
    async function fetchData() {
      await axios
        .get("/api/verify-inviteCode", {
          params: {
            invitecode: inviteCode,
          },
        })
        .then((response) => {
          if (response.status === 204) {
            setIsInvited(true);
          }
        })
        .catch((error) => {
          console.error(error);
          setIsInvited(false);
          if (window.localStorage.getItem("inviteCode"))
            window.localStorage.removeItem("inviteCode");
        }).finally(() => {
          setIsLoading(false)
        })
    }
    fetchData();
  }, [inviteCode]);

  if (redirect) {
    return <Redirect to="/added-user" />;
  }
  if (!isInvited) {
    return (
      <Box
        border
        borderWidth={1}
        align={"center"}
        direction={"column"}
        boxShadow={"lg"}
        borderRadius={"xl"}
        p={"5"}
      >
        <Flex w={"100%"} h={"100%"} justify={"center"} align={"center"}>
          {isLoading ? (
            <Spinner />
          ) : (
            <Heading fontSize={"2xl"}>
              You are not Invited. Please contact Admins
            </Heading>
          )}
        </Flex>
      </Box>
    );
  }
  if (!isOTPSent) {
    return (
      <Box>
        <Stack
          border
          borderWidth={1}
          align={"center"}
          direction={"column"}
          boxShadow={"lg"}
          borderRadius={"xl"}
          p={"5"}
        >
          <Heading fontSize={"2xl"}>Enter Email</Heading>
          <form onSubmit={handleForm}>
            <FormControl id="email">
              <FormLabel>Enter you email</FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="abc@gmail.com"
                  value={email}
                  onChange={handleEmail}
                  isInvalid={!IsAcademic}
                  required
                />
                <Button
                  borderRadius={"md"}
                  ml={1}
                  isLoading={isLoading}
                  type={"submit"}
                  colorScheme={buttonColor}
                  isDisabled={isSubmitted === email}
                >
                  <ArrowRightIcon />
                </Button>
              </InputGroup>
              <Text fontSize={"sm"} color={"red.400"} hidden={IsAcademic}>
                Enter Email
              </Text>
              <FormHelperText>We'll never share your username.</FormHelperText>
            </FormControl>
          </form>
        </Stack>
      </Box>
    );
  }
  return (
    <Box>
      <Stack
        border
        borderWidth={1}
        align={"center"}
        direction={"column"}
        boxShadow={"lg"}
        borderRadius={"xl"}
        p={"5"}
      >
        <Heading fontSize={"2xl"}>Enter OTP</Heading>
        <form onSubmit={handleFormOTP}>
          <FormControl id="OTP">
            <FormLabel>Enter OTP</FormLabel>
            <InputGroup>
              <Input
                type="number"
                placeholder="123456"
                value={OTP}
                onChange={handleOTP}
                isInvalid={!IsValidOTP}
                required
              />
              <Button
                borderRadius={"md"}
                ml={1}
                isLoading={isLoadingOTPButton}
                type={"submit"}
                colorScheme={OTPSubmitbuttonColor}
              >
                <ArrowRightIcon />
              </Button>
            </InputGroup>
            <Text fontSize={"sm"} color={"red.400"} hidden={IsValidOTP}>
              Enter OTP
            </Text>
            <Text fontSize={"sm"}>{email}</Text>
            {/* <Text color={"blue.400"} fontSize={"sm"} onClick={setIsOTPSent(false)}>Change Email</Text> */}
          </FormControl>
        </form>
      </Stack>
    </Box>
  );
}
