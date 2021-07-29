import { ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FormControl, FormLabel, FormHelperText } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

export default function IsInServerDashboard({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [username, setUsername] = useState("");
  const toast = useToast();
  const [buttonColor, setButtonColor] = useState("blue");
  const [isDiscord, setIsDiscord] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState("");
  const [invite, setInvite] = useState([]);

  function handleUsername(e) {
    let username = e.target.value;
    setUsername(username);
    setIsDiscord(false);
    if (username.includes("#")) {
      let sliced = username.split("#");
      if (sliced.length === 2 && sliced[1].length === 4 && !isNaN(sliced[1])) {
        setIsDiscord(true);
      }
    }
  }
  async function handleForm(e) {
    e.preventDefault();
    if (isSubmitted === username) {
      return toast({
        title: "Invite link has been already generated",
        description: "Invite link has been already generated",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    if (invite.length >= 5){
      return toast({
        title: "Reached Maximum number of invites",
        description: "You can generate only 5 links at once",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    if (!isDiscord) {
      return toast({
        title: "Username is invalid",
        description: "The value entered is not a discord username.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(true);
    await axios
      .post("/api/invite", { username: username })
      .then((response) => {
        setInvite([...invite, response.data]);
        setIsSubmitted(username);
        toast({
          title: "Invite Link Generated",
          description:
            "Username entered has been submitted and invite link has been generated.",
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
            "We could not process the entered username. Please try again later.",
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
        <Heading fontSize={"2xl"}>Generate an Invite link</Heading>
        <form onSubmit={handleForm}>
          <FormControl id="username">
            <FormLabel>Enter Discord Username</FormLabel>
            <InputGroup>
              <Input
                type="text"
                placeholder="xyz#0000"
                value={username}
                onChange={handleUsername}
                isInvalid={!isDiscord}
                required
              />
              <Button
                borderRadius={"md"}
                ml={1}
                isLoading={isLoading}
                type={"submit"}
                colorScheme={buttonColor}
                isDisabled={
                  (isSubmitted === username ? true : false) ||
                  invite.length >= 5
                }
              >
                <ArrowRightIcon />
              </Button>
            </InputGroup>
            <Text fontSize={"sm"} color={"red.400"} hidden={isDiscord}>
              Enter discord username
            </Text>
            <FormHelperText>We'll never share your username.</FormHelperText>
          </FormControl>
        </form>
        <Button onClick={onOpen}>View all invite links</Button>
        <InviteModal onClose={onClose} isOpen={isOpen} invite={invite} />
      </Stack>
    </Box>
  );
}

function InviteModal({ onClose, isOpen, invite }) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} scrollBehavior={"outside"}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={2} mt={2}>
            {invite.map((inviteLink) => {
              return (
                <Stack
                  border
                  borderWidth={1}
                  align={"center"}
                  direction={"column"}
                  boxShadow={"lg"}
                  borderRadius={"xl"}
                  p={"5"}
                  key={inviteLink.link}
                >
                  <Heading fontSize={"lg"}>
                    Invite link: {inviteLink.link}
                  </Heading>
                  <Text>{inviteLink.username}</Text>
                </Stack>
              );
            })}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
