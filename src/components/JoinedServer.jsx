import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
export default function JoinedServer({ message }) {
  return (
    <Flex align={"center"} height={"100vh"}>
      <Container>
        <Box>
          <Heading size={"4xl"}>{message.title}</Heading>
          <Text fontSize={"3xl"}>{message.description}</Text>
        </Box>
      </Container>
    </Flex>
  );
}