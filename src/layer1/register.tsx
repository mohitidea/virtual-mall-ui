import React, { useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';

type FormData = {
    name: string;
    email: string;
    password: string;
}

const Register: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChanges = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const validateForm = (): string | null => {
        if (formData.name.trim().length < 2) return 'Name must be at least 2 characters long';
        if (!formData.email.includes('@')) return 'Please enter a valid email address';
        if (formData.password.length < 6) return 'Password must be at least 6 characters long';
        return null;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8080/v1/layer1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'sign up failed');
            }
            setSuccess('Registration successful!');
            setFormData({
                name: '',
                email: '',
                password: '',
            });
        } catch (error) {
            setError((error as Error).message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container style={{ maxWidth: '500px', marginTop: '50px'}}>
            <h3 className="mb-4 text-center">Register</h3>
            {error && <Alert variant= 'danger'> {error } </Alert>}
            {success && <Alert variant= 'success'>{ success} </Alert>}
            <Form onSubmit= { handleSubmit }>
                <Form.Group className= "mb-3" >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder= "Enter your name"
                        value={formData.name}
                        onChange={handleChanges}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder= "Enter your email"
                        value={formData.email}
                        onChange={handleChanges}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder= "Enter your password"
                        value={formData.password}
                        onChange={handleChanges}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className= "w-100">
                    {loading ? <>(<Spinner animation="border" size="sm" /> )</> : ('Register')}
                </Button>
            </Form>
        </Container>
    );
}

export default Register;

