import type {FC} from 'react';
import {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Chip, Divider, Typography} from '@mui/material';
import {useUpdateEffect} from '../../../hooks/use-update-effect';
import {MultiSelect} from '../../multi-select';

export interface Filters {
  status: string[];
}

interface ProjectListFiltersProps {
  onChange?: (filters: Filters) => void;
}

interface FilterItem {
  label: string;
  field: 'status';
  value: unknown;
  displayValue?: unknown;
}

const statusOptions = [
  {
    label: '全部',
    value: '-1'
  },
  {
    label: '未审批',
    value: '0'
  },
  {
    label: '已通过',
    value: '1'
  },
  {
    label: '已拒绝',
    value: '2'
  }
];


export const ProjectListFilters: FC<ProjectListFiltersProps> = (props) => {
  const {onChange, ...other} = props;
  const [filterItems, setFilterItems] = useState<FilterItem[]>([]);


  useUpdateEffect(
    () => {
      const filters: Filters = {
        status: [],
      };

      // Transform the filter items in an object that can be used by the parent component to call the
      // serve with the updated filters
      filterItems.forEach((filterItem) => {
        switch (filterItem.field) {
          case 'status':
            filters.status.push(filterItem.value as string);
            break;
          default:
            break;
        }
      });

      onChange?.(filters);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterItems]
  );

  const handleDelete = (filterItem: FilterItem): void => {
    setFilterItems((prevState) => prevState.filter((_filterItem) => {
      return !(filterItem.field === _filterItem.field && filterItem.value === _filterItem.value);
    }));
  };


  const handleStatusChange = (values: string[]): void => {
    setFilterItems((prevState) => {
      const latestValue = values[values.length - 1];
      // First cleanup the previous filter items
      const newFilterItems = prevState.filter((filterItem) => filterItem.field !== 'status');
      const option = statusOptions.find((option:any) => option.value === latestValue);
      if (!option) {
        return newFilterItems;
      }
      newFilterItems.push({
        label: 'Status',
        field: 'status',
        value: option?.value || '',
        displayValue: option!.label
      });

      return newFilterItems;
    });
  };


  // We memoize this part to prevent re-render issues
  const statusValues = useMemo(
    () => {
      const values = filterItems
        .filter((filterItems) => filterItems.field === 'status')
        .map((filterItems) => filterItems.value) as string[];
      // Since we do not display the "all" as chip, we add it to the multi-select as a selected value
      if (values.length === 0) {
        values.unshift('-1');
      }
      return values;
    },
    [filterItems]
  );


  return (
    <div {...other}>
      <Divider />
      {
        filterItems.length > 0
          ? (
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexWrap: 'wrap',
                p: 2
              }}
            >
              {filterItems.map((filterItem, i) => (
                <Chip
                  key={i}
                  label={(
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        '& span': {
                          fontWeight: 600
                        }
                      }}
                    >
                      <span>
                        {filterItem.label}
                      </span>
                      :
                      {' '}
                      {filterItem.displayValue || filterItem.value}
                    </Box>
                  )}
                  onDelete={(): void => handleDelete(filterItem)}
                  sx={{m: 1}}
                  variant="outlined"
                />
              ))}
            </Box>
          )
          : (
            <Box sx={{p: 3}}>
              <Typography
                color="textSecondary"
                variant="subtitle2"
              >
                No filters applied
              </Typography>
            </Box>
          )
      }
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          p: 1
        }}
      >
        <MultiSelect
          label="审批状态"
          onChange={handleStatusChange}
          options={statusOptions}
          value={statusValues}
        />
      </Box>
    </div>
  );
};

ProjectListFilters.propTypes = {
  onChange: PropTypes.func
};
