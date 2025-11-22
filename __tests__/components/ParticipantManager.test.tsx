import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParticipantManager from '@/components/ParticipantManager';
import { Participant } from '@/lib/secret-santa';

describe('ParticipantManager', () => {
  const mockOnAdd = jest.fn();
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no participants', () => {
    render(
      <ParticipantManager
        participants={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText(/No participants yet/i)).toBeInTheDocument();
  });

  it('should render list of participants', () => {
    const participants: Participant[] = [
      { name: 'Alice', notAllowedNames: [] },
      { name: 'Bob', notAllowedNames: [] },
    ];

    render(
      <ParticipantManager
        participants={participants}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should call onAdd when form is submitted', async () => {
    render(
      <ParticipantManager
        participants={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByPlaceholderText(/Enter participant name/i);
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Charlie' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Charlie');
    });
  });

  it('should call onAdd when Enter is pressed', async () => {
    render(
      <ParticipantManager
        participants={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByPlaceholderText(/Enter participant name/i);
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'Diana' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith('Diana');
    });
  });

  it('should not call onAdd with empty input', () => {
    render(
      <ParticipantManager
        participants={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const addButton = screen.getByText('Add');
    fireEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should call onRemove when remove button is clicked', () => {
    const participants: Participant[] = [
      { name: 'Alice', notAllowedNames: [] },
    ];

    render(
      <ParticipantManager
        participants={participants}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const removeButton = screen.getByLabelText(/Remove Alice/i);
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledWith('Alice');
  });

  it('should clear input after adding participant', async () => {
    render(
      <ParticipantManager
        participants={[]}
        onAdd={mockOnAdd}
        onRemove={mockOnRemove}
      />
    );

    const input = screen.getByPlaceholderText(/Enter participant name/i) as HTMLInputElement;
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'Eve' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});

