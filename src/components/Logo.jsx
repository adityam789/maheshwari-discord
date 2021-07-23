import { Box, Image } from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box>
      <Image
        bg={"transparent"}
        sizes={"sm"}
        p={2}
        htmlWidth={'100'}
        name={"The Real Advisors"}
        src={"./logo.svg"}
      />
    </Box>
  );
}