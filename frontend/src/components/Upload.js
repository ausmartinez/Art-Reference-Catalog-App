import { useState } from "react";
import {
    Box,
    Image,
    Stack,
    Center,
    HStack,
    Button,
    Input,
    Checkbox,
    Select,
    Modal,
    ModalCloseButton,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { FileUploader } from "react-drag-drop-files";

const Upload = () => {
    const [formState, setFormState] = useState({ 
        "tags": "",
        "characters": "",
        "shows": "",
        "gender": "female", 
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [file, setFile] = useState();
    const [pCheck, setPCheck] = useState(false);
    const [nCheck, setNCheck] = useState(false);
    const toast = useToast();
    const fileTypes = ["JPG", "PNG", "GIF"];

    const handleFileChange = (file) => {
        setFile(file);
    };

    const hPCheck = (e) => {
        console.log(e.target.checked);
        setPCheck(e.target.checked);
    }
    const hNCheck = (e) => {
        setNCheck(e.target.checked);
    }

    const resetDat = () => {
        setFormState ({
            "tags": "",
            "characters": "",
            "shows": "",
            "gender": "female",
        });
        setFile(null);
        setPCheck(false);
        setNCheck(false);
    }

    const arrToLower = (arr) => {
      return arr.map(element => {
        return element.toLowerCase().trim();
      });
    };

    const handleClose = () => {
        resetDat();
        onClose();
    }

    const handleChange = (e) => {
        if (e.target.name == "gender") {
            setFormState((prev) => {
                return {
                    ...prev,
                    [e.target.name]: e.target.value,
                };
            });
        } else {
            setFormState((prev) => {
                return {
                    ...prev,
                    [e.target.name]: arrToLower(e.target.value.split(",")),
                };
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(); 
        formData.append("photo", file);
        formData.append("tags", formState.tags);
        formData.append("characters", formState.characters);
        formData.append("shows", formState.shows);
        formData.append("gender", formState.gender);
        formData.append("nsfw", nCheck);
        formData.append("porn", pCheck);
        const requestoptions = {
            method: "post",
            body: formData,
        };
        fetch('http://localhost:8080/uploadImage', requestoptions)
        .then((response) => response.json())
        .then((data, error) =>  {
            if (error || "error" in data) {
                console.log("there was an error with the search");
            } else {
                toast({
                    title: 'Image uploaded.',
                    status: 'success',
                    duration: 4000,
                    isclosable: true,
                });
                onClose();
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <Box>
            <Button onClick={onOpen}>Upload</Button>    
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
                        <form onSubmit={handleSubmit}>
                            <Box pt={5}>
                                <Input 
                                id="tagsUpdate"
                                type="text" 
                                placeholder="Tags" 
                                name="tags" 
                                onChange={handleChange}
                                />
                            </Box>
                            <Box pt={5}>
                                <Input 
                                id="charactersUpdate"
                                type="text" 
                                placeholder="Characters" 
                                name="characters" 
                                onChange={handleChange}
                                />
                            </Box>
                            <Box pt={5}>
                                <Input 
                                id="showsUpdate"
                                type="text" 
                                placeholder="Shows" 
                                name="shows" 
                                onChange={handleChange}
                                />
                            </Box>
                            <Box pt={5}>
                                <Select onChange={handleChange} id="genderUpdate" name="gender" >
                                    <option value="female" >Female</option>
                                    <option value="male" >Male</option>
                                    <option value="other" >Other</option>
                                    <option value="none" >None</option>
                                </Select>
                            </Box>
                            <Center pt={5}>
                            <Stack spacing={5} direction="row">
                                <Checkbox 
                                id="nsfwCheckUpdate"
                                onChange={hNCheck}
                                name="nsfw">NSFW</Checkbox>
                                <Checkbox 
                                id="pornCheckUpdate"
                                name="porn" 
                                onChange={hPCheck}
                                colorScheme="red">Porn</Checkbox>
                            </Stack>
                            </Center>
                            <Center pb={5}>
                                <HStack pt={5} spacing="24px">
                                    <Button type='submit'>Upload</Button>
                                    <Button onClick={handleClose}>Cancel</Button>
                                </HStack>
                            </Center>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>

        </Box>
    );
}

export default Upload;
