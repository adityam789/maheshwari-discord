import { Avatar, Heading, Stack, Text } from "@chakra-ui/react";

export default function User({ user }) {
  return (
    <Stack
      border
      borderWidth={1}
      align={"center"}
      direction={"column"}
      boxShadow={"lg"}
      borderRadius={"xl"}
      p={"5"}
    >
      <Avatar
        name={user.username}
        src={`${user.avatar}?size=1024`}
        bg={"transparent"}
        size={"xl"}
      />
      <Text>Hey There</Text>
      <Heading size={"md"}>
        {user.username}#{user.discriminator}
      </Heading>
    </Stack>
  );
}
