import  {
    Button,
    useToast,
} from "@chakra-ui/react";

const DeleteButton = ({imageId, imagePath, onClose}) => {
    const toast = useToast();
    const deleteImage = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({_id: imageId, path:imagePath}),
        };
        fetch('http://localhost:8080/deleteImage', requestOptions)
        .then((response) => response.json())
        .then((data, error) =>  {
            console.log('does this even trigger');
            if (error || "error" in data) {
                console.log("There was an error with the search");
            } else {
                console.log('we good');
                console.log(data);
                toast({
                    title: 'Image Deleted.',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                onClose();
            }
        })
        .catch(err => {
            console.log(err);
        });
    };
    return (
        <Button onClick={deleteImage}>Delete</Button>
    );
}

export default DeleteButton;
