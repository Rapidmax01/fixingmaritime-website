'use client'

import { useState } from 'react'

export default function TestComponent() {
  const [test, setTest] = useState(false)

  if (test) {
    return (
      <div>Test Success</div>
    );
  }

  return (
    <div>Test Main</div>
  );
}