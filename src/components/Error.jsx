import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
export default function Error({ error }) {
  return (
    <Flex align={"center"} height={"100vh"}>
      <Container>
        <Box>
          <Heading size={"4xl"}>{error.code}</Heading>
          <Text fontSize={"3xl"}>{error.message}</Text>
          <Link to={"/"}>Click here to go back ✨home✨</Link>
        </Box>
      </Container>
    </Flex>
  );
}