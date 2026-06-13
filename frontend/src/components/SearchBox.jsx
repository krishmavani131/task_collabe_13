import React, { useState } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  const [keyword, setKeyword] = useState(urlKeyword || '');

  const submitHandler = (e) => {
    e.preventDefault();

    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Form
      onSubmit={submitHandler}
      className='d-flex align-items-center'
    >
      <InputGroup>
        <Form.Control
          type='text'
          name='q'
          value={keyword}
          placeholder='Search products...'
          onChange={(e) => setKeyword(e.target.value)}
          className='rounded-start-pill shadow-sm border-0'
          style={{
            minWidth: '260px',
            height: '46px',
          }}
        />

        <Button
          type='submit'
          variant='success'
          className='rounded-end-pill px-4 fw-semibold shadow-sm'
          style={{
            height: '46px',
          }}
        >
          🔍 Search
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SearchBox;