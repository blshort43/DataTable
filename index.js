/* eslint-disable no-unused-vars */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Checkbox } from 'components';
import styled from 'styled-components';
import { TriangleDown } from 'styled-icons/octicons/TriangleDown';
import { GET } from 'utils';
import Pagination from '../Pagination';

const Table = styled.table`
  width: 100%;
`;

const Text = styled.p`
  cursor: pointer;
  user-select: none;
`;

const Row = styled.tr`
  height: ${props => props.theme.table.row.height};
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
  box-sizing: border-box;
  :hover {
    background-color: rgba(0, 0, 0, 0.07);
  }
`;
const HeaderCell = styled.th`
  padding: 20px 40px 2px 16px;
  color: #007eff;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.3125rem;
`;

const StyledCell = styled.td`
  background: ${props => props.theme.colors.primary.paper};
  padding: 14px 40px 14px 16px;
  line-height: 20px;
  font-size: 0.875rem;
`;
// const Cell = ({ children }) => (
//   <StyledCell>
//     <div>{children}</div>
//   </StyledCell>
// );

// const StyledTriangle = styled(TriangleDown)`
//   transform: ${props =>
//     // eslint-disable-next-line no-nested-ternary
//     props.sortField !== props.child
//       ? ``
//       : props.direction === 'desc'
//       ? `rotate(180deg)`
//       : `rotate(0deg)`};
//   transition: transform 0.25s linear;
// `;

const DataTable = ({ children, resource }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDirection, setSortDirection] = useState('asc');
  const [sortField, setSortField] = useState('');

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    GET(resource).then(res => setData(res.data));
  };

  const handleChangePage = (e, page) => {
    setCurrentPage(page);
  };

  const handleChangeRows = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const compareValues = (key, order = 'asc') => (a, b) => {
    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };

  const handleChangeSort = value => {
    setSortField(value);

    if (sortDirection === 'asc') {
      setSortDirection('desc');
    } else setSortDirection('asc');

    setData(data.sort(compareValues(value, sortDirection)));
  };

  const renderCell = (record, source, type, suffix) => {
    if (typeof record[source] === 'boolean') {
      if (record[source].toString() === 'true') {
        return <Checkbox style={{ padding: '0px' }} readOnly checked />;
      }
      return <Checkbox style={{ padding: '0px' }} />;
    }
    if (record[source] === null) {
      return `${suffix || ''}`;
    }
    if (type === 'link') {
      return (
        <a
          href={record[source]}
          style={{ textDecoration: 'none', color: '#007eff' }}
        >
          Learn More
        </a>
      );
    }
    return record[source];
  };

  return (
    <div>
      <Table>
        <tbody>
          <tr>
            {React.Children.map(children, (child, i) => (
              <HeaderCell key={i}>
                <div style={{ display: 'flex' }}>
                  <Text
                    onClick={() => handleChangeSort(child.props.source)}
                    style={{ marginTop: '2px' }}
                  >
                    {child.props.label}
                  </Text>
                  {/* <StyledTriangle
                  opacity={showArrow}
                  style={{ margin: '6px 0px 0px 6px', color: 'black' }}
                  cursor="pointer"
                  size="12px"
                  direction={sortDirection}
                  sortField={sortField}
                  child={child.props.source}
                /> */}

                  {/* <input
                  style={{
                    marginLeft: '6px',
                    background: '#fff',
                    height: '24px',
                    borderRadius: '4px',
                    border: '1px solid #b1b1b1',
                    width: '100px',
                  }}
                  type="text"
                  mt="0"
                  width="50%"
                  height="50%"
                /> */}
                </div>
              </HeaderCell>
            ))}
          </tr>
        </tbody>
        <tbody>
          {data
            .slice(
              currentPage * rowsPerPage,
              currentPage * rowsPerPage + rowsPerPage,
            )
            .map((record, i) => (
              <Row key={i}>
                {React.Children.map(children, (child, j) => (
                  <StyledCell key={j}>
                    {renderCell(record, child.props.source, child.props.type) ||
                      child.props.suffix}
                  </StyledCell>
                ))}
              </Row>
            ))}
        </tbody>
      </Table>
      <Pagination
        page={currentPage}
        count={data.length}
        rowsPerPage={rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRows}
      />
    </div>
  );
};

export default DataTable;
