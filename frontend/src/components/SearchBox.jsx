import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const { keyword: keywordFromUrl } = useParams();
  const navigate = useNavigate();

  // Fallback to empty string since keywordFromUrl may be undefined
  const [searchTerm, setSearchTerm] = useState(keywordFromUrl || '');

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTerm = searchTerm.trim();

    if (trimmedTerm) {
      navigate(`/search/${trimmedTerm}`);
      setSearchTerm('');
    } else {
      navigate('/');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        value={searchTerm}
        onChange={handleChange}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      />
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;
