import React from 'react';

export default function About() {
    return (
        <main
            style={{
                maxWidth: '700px',
                margin: '4rem auto',
                padding: '0 1rem',
                color: '#222',
                fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                lineHeight: 1.6,
            }}
        >
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>About Edutransit</h1>

            <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                At Edutransit, all we do is connect people to drivers—and drivers to people.
            </p>

            <p
                style={{
                    fontSize: '1rem',
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    color: '#555',
                }}
            >
                Simple. Efficient. Reliable.
            </p>

            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h2>
                <p>
                    We aim to create seamless connections between riders and drivers, making transportation easy,
                    safe, and accessible for everyone. Whether you're a parent, student, or driver, Edutransit
                    is here to bridge the gap and simplify your journey.
                </p>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Why Choose Us?</h2>
                <ul style={{ paddingLeft: '1.2rem', color: '#555' }}>
                    <li>Reliable and timely connections</li>
                    <li>User-friendly platform for all ages</li>
                    <li>Dedicated to safety and trust</li>
                    <li>Building a community through shared rides</li>
                </ul>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Get in Touch</h2>
                <p>
                    Have questions or want to learn more? Reach out anytime at{' '}
                    <a
                        href="mailto:info@edutransit.com"
                        style={{ color: '#000', textDecoration: 'underline' }}
                    >
                        info@edutransit.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
