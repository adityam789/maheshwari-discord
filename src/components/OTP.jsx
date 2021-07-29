import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function OTP({ setEmailSent, setOTPVerified, email }) {

  const [OTP, setOTP] = useState(0);
  const [IsValidOTP, setIsValidOTP] = useState(false);
  const [isLoadingOTPButton, setisLoadingOTPButton] = useState(false);
  const [OTPSubmitbuttonColor, setOTPSubmitbuttonColor] = useState("blue");

  const toast = useToast();

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
        setOTPVerified(true);
        toast({
          title: "OTP Verified",
          description: "OTP has been submitted and verified.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setOTPSubmitbuttonColor("green");
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
        setOTPSubmitbuttonColor("red");
      })
      .finally(() => {
        setisLoadingOTPButton(false);
      });
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
            <Text color={useColorModeValue("blue.300","blue.600")} fontSize={"sm"} onClick={setEmailSent(false)}>Change Email</Text>
          </FormControl>
        </form>
      </Stack>
    </Box>
  );
}
