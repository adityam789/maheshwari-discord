import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Notinvited({ setIsInvited }) {
  const [loading, setLoading] = useState(true);

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
        })
        .finally(() => {
          setLoading(false);
        });
    }
    fetchData();
  }, []);

  if (loading) {
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
          <Spinner size={"xl"} />
        </Flex>
      </Box>
    );
  }
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
        <Heading fontSize={"2xl"}>
          You are not Invited. Please contact Admins
        </Heading>
      </Flex>
    </Box>
  );
}
