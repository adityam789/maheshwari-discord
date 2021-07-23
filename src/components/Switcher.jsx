import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Spacer, useColorMode } from "@chakra-ui/react";
import Logo from "./Logo";

export default function Switcher() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      justifyContent={"space-between"}
      align={"center"}
      p={3}
      position={"fixed"}
      height={"8vh"}
      w={"100%"}
    >
      <Logo />
      <Spacer />
      <IconButton
        icon={colorMode === "light" ? <SunIcon /> : <MoonIcon />}
        onClick={toggleColorMode}
        borderRadius={"full"}
      />
    </Flex>
  );
}
