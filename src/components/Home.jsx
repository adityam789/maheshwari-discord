import {
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Home() {

  let query = new URLSearchParams(useLocation().search);
  const inviteCode = query.get("invitecode")

  if(inviteCode){
    window.localStorage.setItem("inviteCode", inviteCode)
  }

  const MotionFlex = motion(Flex);

  return (
    <MotionFlex
      align={"center"}
      h={"100vh"}
      animate="in"
      initial="initial"
      exit="out"
      variants={{
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 },
      }}
      transition={{ duration: 1 }}
    >
      <Container>
        <Heading>
          <Text fontSize={{ base: "2xl", md: "4xl" }}>Welcome to</Text>
          <Text
            fontSize={{ base: "4xl", md: "6xl" }}
            bgGradient="linear(to-l, #347eeb,#cf2d08)"
            bgClip="text"
          >
            The Maheshwari Clan
          </Text>
          <Link textDecoration={"none"} href={"/api/oauth-passport/discord"}>
            <Button textDecoration={"none"}>
              Login with
              <Image
                h={"100%"}
                mx={"3"}
                src={useColorModeValue(
                  "https://discord.com/assets/92ad040ed5143bfb541ea61f5c3bb18f.svg",
                  "https://discord.com/assets/364fc8a0ee7fcebf47ca6ebd16ec12f1.svg"
                )}
              />
            </Button>
          </Link>
        </Heading>
      </Container>
    </MotionFlex>
  );
}
