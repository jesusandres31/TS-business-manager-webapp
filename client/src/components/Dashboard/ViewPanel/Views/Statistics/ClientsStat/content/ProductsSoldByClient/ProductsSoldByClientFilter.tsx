import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { unwrapResult } from '@reduxjs/toolkit';
// global state
import { useAppDispatch } from '../../../../../../../../app/store';
import { fetchProductsSoldByClient } from '../../../../../../../../features/statistics/statisticsSlice';
// interface
import { IProductsSoldByClient } from '../../../../../../../../api/statistic.services';
import { IDate } from '../../../../../../../../interfaces';
// utils
import {
  formatDateFrom,
  formatDateTo,
} from '../../../../../../../../utils/formatDate';
// context
import { useLanguage } from '../../../../../../../../context/LanguageContext';
import { useSnackbar } from '../../../../../../../../context/SnackbarContext';
// components
import { DateInputs } from '../../../../../common/Statistics';

interface ProductsSoldByClientFilterProps {
  setProductsSoldByClient: React.Dispatch<
    React.SetStateAction<IProductsSoldByClient[]>
  >;
  clientId: number | null;
}

export default function ProductsSoldByClientFilter({
  setProductsSoldByClient,
  clientId,
}: ProductsSoldByClientFilterProps) {
  const dispatch = useAppDispatch();

  const {
    dispatch: { errorSnackbar },
  } = useSnackbar();

  const {
    dispatch: { translate },
  } = useLanguage();

  const [rangedDate, setRangedDate] = useState<IDate>({
    dateFrom: null,
    dateTo: null,
  });

  const handleFetchProductsSoldByClient = (
    clientId: number,
    formatedDate: IDate
  ) => {
    dispatch(fetchProductsSoldByClient({ clientId, date: formatedDate }))
      .then(unwrapResult)
      .then((payload) => {
        setProductsSoldByClient(payload);
      })
      .catch((err) => {
        errorSnackbar();
        throw err;
      });
  };

  useEffect(() => {
    handleRemoveFilter();
  }, [clientId]);

  const handleFilter = () => {
    if (clientId) {
      const formatedDate: IDate = {
        dateFrom: formatDateFrom(rangedDate.dateFrom as Date),
        dateTo: formatDateTo(rangedDate.dateTo as Date),
      };
      handleFetchProductsSoldByClient(clientId, formatedDate);
    } else {
      setProductsSoldByClient([]);
    }
  };

  const handleRemoveFilter = () => {
    if (clientId) {
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const formatedDate: IDate = {
        dateFrom: '1900-01-01',
        dateTo: tomorrow,
      };
      handleFetchProductsSoldByClient(clientId, formatedDate);
    } else {
      setProductsSoldByClient([]);
    }
    setRangedDate({ ...rangedDate, dateFrom: null, dateTo: null });
  };

  return (
    <>
      <Grid item xs={12} sm={5}>
        <Box pt={0}>
          <DateInputs
            rangedDate={rangedDate}
            setRangedDate={setRangedDate}
            id={'ProductsSoldByClient'}
          />
        </Box>
      </Grid>

      <Grid item xs={12} sm={3}>
        <Box pt={2.5} display="flex" justifyContent="flex-start">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleFilter}
            disabled={
              rangedDate.dateFrom === null || rangedDate.dateTo === null
            }
          >
            {translate('filter')}
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Box pt={2.5} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleRemoveFilter}
            disabled={
              rangedDate.dateFrom === null && rangedDate.dateTo === null
            }
          >
            {translate('removeFilter')}
          </Button>
        </Box>
      </Grid>
    </>
  );
}
