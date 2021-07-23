import { Flex, Spinner } from "@chakra-ui/react";

export default function Loading() {
  return (
    <Flex align={"center"} justify={"center"} h={"100vh"}>
      <Spinner size="xl" />
    </Flex>
  );
}