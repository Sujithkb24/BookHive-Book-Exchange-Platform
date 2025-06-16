const getBookDetails = async (isbn) => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
        console.log(response);
    } catch (error) {
        console.error('Error fetching book details:', error);
        throw error;
    }
}

module.exports = {
    getBookDetails
};