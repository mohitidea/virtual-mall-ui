import Reeact, { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

type FormData = {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const [FormData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setErorr] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...FormData,
            [e.target.name]: e.target.value,
        });
    }

    const validateForm = (): string | null => {
        if (!FormData.email.includes('@')) return 'Please enter a valid email address';
        if (FormData.password.length < 6) return 'Password must be at least 6 characters long';
        return null
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErorr(null);
        setSuccess(null);
        const validationError = validateForm();
        if (validationError) {
            setErorr(validationError);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/v1/layer1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(FormData),
            });
            const data = await response.json();
            if (!response.ok) {
                setErorr(data.message || 'Login failed');
            } else {
                setSuccess('Login successful!');
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
        } catch (error) {
            setErorr('An error occurred during login');
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container style={{ maxWidth: '400px', marginTop: '50px' }}>
            <h3 className="mb-4 text-center">Login</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        value={FormData.email}
                        onChange={handleChanges}
                        placeholder="Enter email"
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={FormData.password}
                        onChange={handleChanges}
                        placeholder="Enter password"
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Login'}
                </Button>
                <p className="mt-3 text-center">
                    Don't have an account? <a href="/register">Register</a>
                </p>
            </Form>
        </Container>
    )
}

export default Login;