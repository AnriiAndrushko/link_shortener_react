import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import UrlTable from '../UrlTable';
import getUrlByCode from '../api_calls/getUrlByCode';
import deleteUrlByCode from '../api_calls/deleteUrlByCode';

jest.mock('../api_calls/getUrlByCode');
jest.mock('../api_calls/deleteUrlByCode');

describe('UrlTable', () => {
    const windowOpenFn = jest.fn();
    let data;
    let setData;
    let curTableLink;
    let props;

    delete window.open;
    window.open = windowOpenFn;

    beforeEach(() => {
        data = [
            {
                code: 'abc123',
                url: 'https://example.com',
                owner: 'Alice',
                clicked: 0,
            },
            {
                code: 'def456',
                url: 'https://example.org',
                owner: 'Bob',
                clicked: 2,
            },
        ];
        setData = jest.fn();
        curTableLink = { current: 'test-table' };
        props = { data, setData, curTableLink };

        getUrlByCode.mockClear();
        deleteUrlByCode.mockClear();
    });

    afterEach(() => {
        windowOpenFn.mockClear();
    });

    test('displays the table header', () => {
        render(<UrlTable {...props} />);
        const headers = screen.getAllByRole('columnheader');
        expect(headers).toHaveLength(5);
        expect(headers[0]).toHaveTextContent('Original URL');
        expect(headers[1]).toHaveTextContent('Short URL');
        expect(headers[2]).toHaveTextContent('Owner');
        expect(headers[3]).toHaveTextContent('Clicked');
        expect(headers[4]).toHaveTextContent('Delete btn');
    });

    test('displays the data rows', () => {
        render(<UrlTable {...props} />);
        const rows = screen.getAllByRole('row');
        expect(rows).toHaveLength(3); // including the header row
        expect(rows[1]).toHaveTextContent(data[0].url.slice(0, 120));
        expect(rows[1]).toHaveTextContent(data[0].code);
        expect(rows[1]).toHaveTextContent(data[0].owner);
        expect(rows[1]).toHaveTextContent(data[0].clicked.toString());
        expect(rows[2]).toHaveTextContent(data[1].url.slice(0, 120));
        expect(rows[2]).toHaveTextContent(data[1].code);
        expect(rows[2]).toHaveTextContent(data[1].owner);
        expect(rows[2]).toHaveTextContent(data[1].clicked.toString());
    });

    test('handles click on short URL', async () => {
        render(<UrlTable {...props} />);
        const tmpClicked = data[0].clicked;
        getUrlByCode.mockResolvedValue('https://example.com');
        const shortUrl = screen.getByText(data[0].code);
        fireEvent.click(shortUrl);
        expect(getUrlByCode).toHaveBeenCalledWith('test-table', data[0].code);
        await waitFor(() => {
            expect(props.setData).toHaveBeenCalledWith([
                { ...data[0], clicked: tmpClicked+1},
                data[1],
            ]);
        });
    });

    test('handles click on delete button', async () => {
        render(<UrlTable {...props} />);
        deleteUrlByCode.mockResolvedValue({ status: 200 });
        const deleteBtn = screen.getAllByText('Delete')[0];
        fireEvent.click(deleteBtn);

        expect(deleteUrlByCode).toHaveBeenCalledWith('test-table', data[0].code);
        await waitFor(() => {
            expect(props.setData).toHaveBeenCalledWith([data[1]]);
        });

    });
});