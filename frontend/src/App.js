import { ChakraProvider } from "@chakra-ui/react";

import { useState } from "react";

import {
    Container,
    Heading,
    Center,
    SimpleGrid,
    GridItem,
    Image,
    useDisclosure,
} from "@chakra-ui/react";

import ImageModal from "./components/ImageModal";
import QueryForm from "./components/QueryForm";

function App() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState({});

  return (
      <ChakraProvider>
        <div className="App">
        <Container>
            <Heading pt={7} > Photo Reference Database </Heading>
            <QueryForm setImages={setImages} />
        </Container>
        <Center pt={10}>
            <SimpleGrid columns={5} gap={6}>
                {images.map((image, index) => (
                    <GridItem key={"image"+index}>
                        <button onClick={() => {
                            setSelectedImage(image); 
                            onOpen();
                        }}>
                            <Image src={process.env.PUBLIC_URL + "/images/" + image.path} />
                            <ImageModal 
                            selectedImage={selectedImage} 
                            nsfw={selectedImage.nsfw}
                            porn={selectedImage.porn}
                            isOpen={isOpen} 
                            onClose={onClose} />
                        </button>
                   </GridItem>
                ))}
            </SimpleGrid>
        </Center>
        </div>
      </ChakraProvider>
  );
}

export default App;
