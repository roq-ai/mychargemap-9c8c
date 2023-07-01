import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getChargingStationById, updateChargingStationById } from 'apiSdk/charging-stations';
import { Error } from 'components/error';
import { chargingStationValidationSchema } from 'validationSchema/charging-stations';
import { ChargingStationInterface } from 'interfaces/charging-station';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

function ChargingStationEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ChargingStationInterface>(
    () => (id ? `/charging-stations/${id}` : null),
    () => getChargingStationById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ChargingStationInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateChargingStationById(id, values);
      mutate(updated);
      resetForm();
      router.push('/charging-stations');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ChargingStationInterface>({
    initialValues: data,
    validationSchema: chargingStationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Charging Station
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="location" mb="4" isInvalid={!!formik.errors?.location}>
              <FormLabel>Location</FormLabel>
              <Input type="text" name="location" value={formik.values?.location} onChange={formik.handleChange} />
              {formik.errors.location && <FormErrorMessage>{formik.errors?.location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
              <FormLabel>Description</FormLabel>
              <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
              {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
            </FormControl>
            <FormControl id="charging_ports" mb="4" isInvalid={!!formik.errors?.charging_ports}>
              <FormLabel>Charging Ports</FormLabel>
              <NumberInput
                name="charging_ports"
                value={formik.values?.charging_ports}
                onChange={(valueString, valueNumber) =>
                  formik.setFieldValue('charging_ports', Number.isNaN(valueNumber) ? 0 : valueNumber)
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              {formik.errors.charging_ports && <FormErrorMessage>{formik.errors?.charging_ports}</FormErrorMessage>}
            </FormControl>
            <FormControl id="charging_type" mb="4" isInvalid={!!formik.errors?.charging_type}>
              <FormLabel>Charging Type</FormLabel>
              <Input
                type="text"
                name="charging_type"
                value={formik.values?.charging_type}
                onChange={formik.handleChange}
              />
              {formik.errors.charging_type && <FormErrorMessage>{formik.errors?.charging_type}</FormErrorMessage>}
            </FormControl>
            <FormControl id="image" mb="4" isInvalid={!!formik.errors?.image}>
              <FormLabel>Image</FormLabel>
              <Input type="text" name="image" value={formik.values?.image} onChange={formik.handleChange} />
              {formik.errors.image && <FormErrorMessage>{formik.errors?.image}</FormErrorMessage>}
            </FormControl>

            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'charging_station',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ChargingStationEditPage);
