import { useState, useEffect } from 'react';

import {
    Input,
    Stack,
    Checkbox,
    Select,
    Box,
    HStack,
    Button,
    Center,
    Image,
    Modal,
    ModalCloseButton,
    ModalOverlay,
    ModalContent,
    ModalBody,
    useToast,
} from "@chakra-ui/react";

const ImageModal = ({selectedImage, nsfw, porn, isOpen, onClose}) => {
    const [formData, setFormData] = useState(selectedImage);
    const toast = useToast();

    useEffect(() => {
        setFormData(selectedImage);
    }, [selectedImage]);

    const arrToLower = (arr) => {
      return arr.map(element => {
        return element.toLowerCase().trim();
      });
    };

    const handleChange = (e) => {
        if (e.target.name === "nsfw" || e.target.name === "porn") {
            setFormData((prev) => {
                return {
                    ...prev,
                    [e.target.name]: e.target.checked,
                };
            });
        } else if (e.target.name == "gender") {
            setFormData((prev) => {
                return {
                    ...prev,
                    [e.target.name]: e.target.value,
                };
            });
        } else {
            setFormData((prev) => {
                return {
                    ...prev,
                    [e.target.name]: arrToLower(e.target.value.split(",")),
                };
            });
        }

    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const id = formData['_id'];
        const tags = formData.tags;
        const characters = formData.characters;
        const shows = formData.shows;
        const gender = formData.gender;
        const nsfw = formData.nsfw;
        const porn = formData.porn;
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id, tags, characters, shows, gender, nsfw, porn,
            }),
        };
        fetch('http://localhost:8080/updateImage', requestOptions)
        .then((response) => response.json())
        .then((data, error) =>  {
            if (error || "error" in data) {
                console.log("There was an error with the search");
            } else {
                console.log(data);
                toast({
                    title: 'Image Updated.',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalCloseButton />
                <ModalBody>
                    <Image 
                    src={process.env.PUBLIC_URL + "/images/" + selectedImage.path} 
                    pt={10}
                    />
                    {selectedImage.path}
                    <form onSubmit={handleSubmit}>
                        <Box pt={5}>
                            <Input 
                            id="tagsUpdate"
                            type="text" 
                            placeholder="Tags" 
                            defaultValue={selectedImage.tags}
                            name="tags" 
                            onChange={handleChange}
                            />
                        </Box>
                        <Box pt={5}>
                            <Input 
                            id="charactersUpdate"
                            type="text" 
                            placeholder="Characters" 
                            defaultValue={selectedImage.characters}
                            name="characters" 
                            onChange={handleChange}
                            />
                        </Box>
                        <Box pt={5}>
                            <Input 
                            id="showsUpdate"
                            type="text" 
                            placeholder="Shows" 
                            defaultValue={selectedImage.shows}
                            name="shows" 
                            onChange={handleChange}
                            />
                        </Box>
                        <Box pt={5}>
                            <Select onChange={handleChange} id="genderUpdate" defaultValue={selectedImage.gender} name="gender" >
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
                            defaultChecked={formData.nsfw && true}
                            onChange={handleChange}
                            name="nsfw">NSFW</Checkbox>
                            <Checkbox 
                            id="pornCheckUpdate"
                            name="porn" 
                            onChange={handleChange}
                            defaultChecked={selectedImage.porn && true}
                            colorScheme="red">Porn</Checkbox>
                        </Stack>
                        </Center>
                        <Center pb={5}>
                            <HStack pt={5} spacing="24px">
                                <Button type='submit'>Update</Button>
                                <Button onClick={onClose}>Close</Button>
                            </HStack>
                        </Center>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ImageModal;
