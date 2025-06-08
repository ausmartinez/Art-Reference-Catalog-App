import { useState } from "react";

import {
    Input,
    Stack,
    Checkbox,
    Select,
    Box,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    HStack,
    Button,
    Center,
} from "@chakra-ui/react";

const QueryForm = ({setImages}) => {
    const [params, setParams] = useState({ 
        "tags": "",
        "characters": "",
        "shows": "",
        "gender": "female", 
        "nsfwQ": "off",
        "pornQ": "off",
        "ascending": "off",
        "imageCount": 5 
    });

    const [pCheck, setPCheck] = useState(false);
    const [nCheck, setNCheck] = useState(false);

    const hpCheck = (e) => {
        setPCheck(e.target.checked);
    }
    const hnCheck = (e) => {
        setNCheck(e.target.checked);
    }

    const generateParams = (random) => {
        return new URLSearchParams({
            tags: params['tags'],
            characters: params['characters'],
            shows: params['shows'],
            gender: params['gender'],
            nsfw: nCheck,
            porn: pCheck,
            amount: parseInt(params['imageCount']),
            ascending: params['ascending'],
            random: random,
        });
    }

    const handleChange = (e) => {
        setParams((prev) => {
            return {
                ...prev,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleNumberChange = (valueString) => {
        setParams((prev) => {
            return {
                ...prev,
                imageCount: parseFloat(valueString) || 5,
            };
        });
    };

    const getImages = (random) => {
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        // Need to generate parameters from html, then include them in the url
        fetch('http://localhost:8080/getImages?' + generateParams(random), requestOptions)
        .then((response) => response.json())
        .then((data, error) =>  {
            if (error || "error" in data) {
                console.log("There was an error with the search");
            } else {
                //console.log(data);
                setImages(data);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleSearch = (event) => {
        event.preventDefault();
        getImages(false);
    }

    const handleRandom = (event) => {
        event.preventDefault();
        getImages(true);
    }
 
    return (
        <Box>
        <form>
            <Box pt={5}>
                <Input onChange={handleChange} type="text" placeholder="Tags" defaultValue="" name="tags" />
            </Box>
            <Box pt={5}>
                <Input onChange={handleChange} type="text" placeholder="Character" defaultValue="" name="characters" />
            </Box>
            <Box pt={5}>
                <Input onChange={handleChange} type="text" placeholder="Shows" defaultValue="" name="shows" />
            </Box>
            <Box pt={5}>
                <Select name="gender" onChange={handleChange}>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                    <option value="none">None</option>
                </Select>
            </Box>
            <Center pt={5}>
                <Stack spacing={5} direction="row">
                    <Checkbox name="nsfwQ" onChange={hnCheck}>NSFW</Checkbox>
                    <Checkbox name="pornQ" onChange={hpCheck} colorScheme="red">Porn</Checkbox>
                    <Checkbox name="ascending" onChange={handleChange}>Ascending</Checkbox>
                </Stack>
            </Center>
            <Center>
                <HStack pt={5} spacing="24px">
                    <NumberInput name="imageCount" onChange={handleNumberChange} defaultValue={5} min={0} max={600} maxW="100px" mr="2rem" >
                        <NumberInputField />
                        <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Button onClick={ handleSearch }>Search</Button>
                    <Button onClick={ handleRandom }>Random</Button>
                </HStack>
            </Center>
        </form>
        </Box>
    );
};

export default QueryForm;
