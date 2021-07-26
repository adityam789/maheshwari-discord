// import { ArrowRightIcon, EmailIcon } from "@chakra-ui/icons";
// import { Button, Input, InputGroup, Stack, Text, useToast } from "@chakra-ui/react";
// import axios from "axios";
// import { useState } from "react";
// import * as swot from "swot-node";

export default function NotInServerDashboard(user){
  return "ASSSS"
}

// function EmailForm() {
//     const toast = useToast();
//     const [email, setEmail] = useState("");
//     const [buttonColor, setButtonColor] = useState("blue");
//     const [isAcademic, setIsAcademic] = useState(true);
//     const [isLoading, setIsLoading] = useState(false);
  
//     async function handleEmail(event) {
//       setEmail(event.target.value);
//       let isAcademicEmail = await swot.isAcademic(event.target.value);
//       if (isAcademicEmail) {
//         setIsAcademic(true);
//       } else {
//         setIsAcademic(false);
//       }
//       event.preventDefault();
//     }
  
//     function handleForm(event) {
//       if (isAcademic) {
//         setIsLoading(true);
//         axios
//           .post("/api/email", { email: email })
//           .then((response) => {
//             setIsLoading(false);
//             if (response.data === "User already verified") {
//               toast({
//                 title: "User is already verified",
//                 description: "A verified role already exists on your user.",
//                 status: "warning",
//                 duration: 5000,
//                 isClosable: true,
//               });
//               setButtonColor("orange");
//             } else {
//               toast({
//                 title: "Email Sent",
//                 description:
//                   "Your verification request has been submitted. Please check your college email.",
//                 status: "success",
//                 duration: 5000,
//                 isClosable: true,
//               });
//               setButtonColor("green");
//             }
//           })
//           .catch((err) => {
//             setIsLoading(false);
//             toast({
//               title: "An Error occured",
//               description:
//                 "We could not process your email. Please try again later.",
//               status: "error",
//               duration: 4000,
//               isClosable: true,
//             });
//             console.log(err);
//             setButtonColor("red");
//           });
//       } else {
//         toast({
//           title: "Email is Non Academic",
//           description:
//             "The email you entered is not academic. If you're facing trouble, we request to apply for verification manually",
//           status: "warning",
//           duration: 2000,
//           isClosable: true,
//         });
//       }
//       event.preventDefault();
//       event.target.reset();
//     }
  
//     return (
//       <Stack direction={"column"} align={"center"}>
//         <EmailIcon w={"70px"} h={"70px"} />
//         <Text fontSize={"lg"}>Verify Using College Email</Text>
//         <form onSubmit={handleForm}>
//           <InputGroup>
//             <Input
//               placeholder="john@example.edu"
//               name={"college-email"}
//               onChange={handleEmail}
//               value={email}
//               type={"email"}
//               isInvalid={!isAcademic}
//               required
//             />
  
//             <Button
//               borderRadius={"md"}
//               ml={1}
//               isLoading={isLoading}
//               type={"submit"}
//               colorScheme={buttonColor}
//             >
//               <ArrowRightIcon />
//             </Button>
//           </InputGroup>
//           <Text fontSize={"sm"} color={"red.400"} hidden={isAcademic}>
//             Enter an academic email
//           </Text>
//         </form>
//       </Stack>
//     );
//   }