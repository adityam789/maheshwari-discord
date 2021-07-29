import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import * as swot from "swot-node";

export default function Email({ setEmailSent, setEmailExternal }) {

  const [buttonColor, setButtonColor] = useState("blue");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState("");
  const [email, setEmail] = useState("");
  const [IsAcademic, setIsAcademic] = useState(false);

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
        setEmailExternal(email)
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
        setEmailSent(true);
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
            <FormHelperText>We'll never share your Email.</FormHelperText>
          </FormControl>
        </form>
      </Stack>
    </Box>
  );
}
