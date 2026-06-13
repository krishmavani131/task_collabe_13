import { Container, Row, Col } from 'react-bootstrap';

const COLUMN_SIZES = {
  xs: 12,
  md: 6,
};

function FormContainer({ children }) {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={COLUMN_SIZES.xs} md={COLUMN_SIZES.md}>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default FormContainer;