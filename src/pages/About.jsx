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
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
                About Kryvervoer
            </h1>

            <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                Kryvervoer makes school transport simple, safe, and reliable.
            </p>

            <p
                style={{
                    fontSize: '1rem',
                    marginTop: '1.5rem',
                    textAlign: 'center',
                    color: '#555',
                }}
            >
                Built for parents and drivers.
            </p>

            <section style={{ marginTop: '3rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Our Mission
                </h2>
                <p>
                    Our mission is to connect parents with trusted, reliable drivers
                    for daily school commutes. We focus on safety, transparency, and
                    ease of use so that parents can have peace of mind knowing their
                    children are in good hands.
                </p>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Why Choose Kryvervoer?
                </h2>
                <ul style={{ paddingLeft: '1.2rem', color: '#555' }}>
                    <li>Focused specifically on school transport</li>
                    <li>Connects parents with drivers</li>
                    <li>Simple and easy-to-use platform</li>
                    <li>Built around safety, trust, and reliability</li>
                </ul>
            </section>

            <section style={{ marginTop: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                    Get in Touch
                </h2>
                <p>
                    Have questions or want to learn more? Reach out to us at{' '}
                    <a
                        href="mailto:info@kryvervoer.com"
                        style={{ color: '#000', textDecoration: 'underline' }}
                    >
                        info@kryvervoer.com
                    </a>
                    .
                </p>
            </section>
        </main>
    );
}
