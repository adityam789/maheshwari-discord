import { Box, Flex, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Error from "./Error";
import IsInServerDashboard from "./IsInServerDashboard";
import Loading from "./Loading";
import NotInServerDashboard from "./NotInServerDashboard";
import User from "./User";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get("/api/user")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setData({
          error: { code: 401, message: "Token has expired, Login again." },
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (data.error) {
    return <Error error={data.error} />;
  }

  if (!data.user.isInServer) {
    return (
      <Flex h={"100vh"} w={"full"} align={"center"} justify={"center"}>
        <Stack direction={{ md: "row", base: "column" }}>
          <Box>
            <User user={data.user} />
          </Box>
          <IsInServerDashboard user={data.user} />
        </Stack>
      </Flex>
    );
  } else {
    return (
      <Flex h={"100vh"} w={"full"} align={"center"} justify={"center"}>
        <Stack direction={{ md: "row", base: "column" }}>
          <Box>
            <User user={data.user} />
          </Box>
          <NotInServerDashboard />
        </Stack>
      </Flex>
    );
  }
}
