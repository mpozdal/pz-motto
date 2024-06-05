/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Autocomplete,
  Badge,
  Button,
  Divider,
  Flex,
  Grid,
  Icon,
  ScrollView,
  Text,
  TextField,
  useTheme,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getCategory, listDrinks } from "../graphql/queries";
import { updateCategory, updateDrink } from "../graphql/mutations";
const client = generateClient();
function ArrayField({
  items = [],
  onChange,
  label,
  inputFieldRef,
  children,
  hasError,
  setFieldValue,
  currentFieldValue,
  defaultFieldValue,
  lengthLimit,
  getBadgeText,
  runValidationTasks,
  errorMessage,
}) {
  const labelElement = <Text>{label}</Text>;
  const {
    tokens: {
      components: {
        fieldmessages: { error: errorStyles },
      },
    },
  } = useTheme();
  const [selectedBadgeIndex, setSelectedBadgeIndex] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  React.useEffect(() => {
    if (isEditing) {
      inputFieldRef?.current?.focus();
    }
  }, [isEditing]);
  const removeItem = async (removeIndex) => {
    const newItems = items.filter((value, index) => index !== removeIndex);
    await onChange(newItems);
    setSelectedBadgeIndex(undefined);
  };
  const addItem = async () => {
    const { hasError } = runValidationTasks();
    if (
      currentFieldValue !== undefined &&
      currentFieldValue !== null &&
      currentFieldValue !== "" &&
      !hasError
    ) {
      const newItems = [...items];
      if (selectedBadgeIndex !== undefined) {
        newItems[selectedBadgeIndex] = currentFieldValue;
        setSelectedBadgeIndex(undefined);
      } else {
        newItems.push(currentFieldValue);
      }
      await onChange(newItems);
      setIsEditing(false);
    }
  };
  const arraySection = (
    <React.Fragment>
      {!!items?.length && (
        <ScrollView height="inherit" width="inherit" maxHeight={"7rem"}>
          {items.map((value, index) => {
            return (
              <Badge
                key={index}
                style={{
                  cursor: "pointer",
                  alignItems: "center",
                  marginRight: 3,
                  marginTop: 3,
                  backgroundColor:
                    index === selectedBadgeIndex ? "#B8CEF9" : "",
                }}
                onClick={() => {
                  setSelectedBadgeIndex(index);
                  setFieldValue(items[index]);
                  setIsEditing(true);
                }}
              >
                {getBadgeText ? getBadgeText(value) : value.toString()}
                <Icon
                  style={{
                    cursor: "pointer",
                    paddingLeft: 3,
                    width: 20,
                    height: 20,
                  }}
                  viewBox={{ width: 20, height: 20 }}
                  paths={[
                    {
                      d: "M10 10l5.09-5.09L10 10l5.09 5.09L10 10zm0 0L4.91 4.91 10 10l-5.09 5.09L10 10z",
                      stroke: "black",
                    },
                  ]}
                  ariaLabel="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeItem(index);
                  }}
                />
              </Badge>
            );
          })}
        </ScrollView>
      )}
      <Divider orientation="horizontal" marginTop={5} />
    </React.Fragment>
  );
  if (lengthLimit !== undefined && items.length >= lengthLimit && !isEditing) {
    return (
      <React.Fragment>
        {labelElement}
        {arraySection}
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {labelElement}
      {isEditing && children}
      {!isEditing ? (
        <>
          <Button
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Add item
          </Button>
          {errorMessage && hasError && (
            <Text color={errorStyles.color} fontSize={errorStyles.fontSize}>
              {errorMessage}
            </Text>
          )}
        </>
      ) : (
        <Flex justifyContent="flex-end">
          {(currentFieldValue || isEditing) && (
            <Button
              children="Cancel"
              type="button"
              size="small"
              onClick={() => {
                setFieldValue(defaultFieldValue);
                setIsEditing(false);
                setSelectedBadgeIndex(undefined);
              }}
            ></Button>
          )}
          <Button size="small" variation="link" onClick={addItem}>
            {selectedBadgeIndex !== undefined ? "Save" : "Add"}
          </Button>
        </Flex>
      )}
      {arraySection}
    </React.Fragment>
  );
}
export default function CategoryUpdateForm(props) {
  const {
    id: idProp,
    category: categoryModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    name: "",
    drinks: [],
  };
  const [name, setName] = React.useState(initialValues.name);
  const [drinks, setDrinks] = React.useState(initialValues.drinks);
  const [drinksLoading, setDrinksLoading] = React.useState(false);
  const [drinksRecords, setDrinksRecords] = React.useState([]);
  const autocompleteLength = 10;
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = categoryRecord
      ? { ...initialValues, ...categoryRecord, drinks: linkedDrinks }
      : initialValues;
    setName(cleanValues.name);
    setDrinks(cleanValues.drinks ?? []);
    setCurrentDrinksValue(undefined);
    setCurrentDrinksDisplayValue("");
    setErrors({});
  };
  const [categoryRecord, setCategoryRecord] = React.useState(categoryModelProp);
  const [linkedDrinks, setLinkedDrinks] = React.useState([]);
  const canUnlinkDrinks = true;
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCategory.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCategory
        : categoryModelProp;
      const linkedDrinks = record?.drinks?.items ?? [];
      setLinkedDrinks(linkedDrinks);
      setCategoryRecord(record);
    };
    queryData();
  }, [idProp, categoryModelProp]);
  React.useEffect(resetStateValues, [categoryRecord, linkedDrinks]);
  const [currentDrinksDisplayValue, setCurrentDrinksDisplayValue] =
    React.useState("");
  const [currentDrinksValue, setCurrentDrinksValue] = React.useState(undefined);
  const drinksRef = React.createRef();
  const getIDValue = {
    drinks: (r) => JSON.stringify({ id: r?.id }),
  };
  const drinksIdSet = new Set(
    Array.isArray(drinks)
      ? drinks.map((r) => getIDValue.drinks?.(r))
      : getIDValue.drinks?.(drinks)
  );
  const getDisplayValue = {
    drinks: (r) => `${r?.name ? r?.name + " - " : ""}${r?.id}`,
  };
  const validations = {
    name: [{ type: "Required" }],
    drinks: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  const fetchDrinksRecords = async (value) => {
    setDrinksLoading(true);
    const newOptions = [];
    let newNext = "";
    while (newOptions.length < autocompleteLength && newNext != null) {
      const variables = {
        limit: autocompleteLength * 5,
        filter: {
          or: [{ name: { contains: value } }, { id: { contains: value } }],
        },
      };
      if (newNext) {
        variables["nextToken"] = newNext;
      }
      const result = (
        await client.graphql({
          query: listDrinks.replaceAll("__typename", ""),
          variables,
        })
      )?.data?.listDrinks?.items;
      var loaded = result.filter(
        (item) => !drinksIdSet.has(getIDValue.drinks?.(item))
      );
      newOptions.push(...loaded);
      newNext = result.nextToken;
    }
    setDrinksRecords(newOptions.slice(0, autocompleteLength));
    setDrinksLoading(false);
  };
  React.useEffect(() => {
    fetchDrinksRecords("");
  }, []);
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          name,
          drinks: drinks ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(
                    fieldName,
                    item,
                    getDisplayValue[fieldName]
                  )
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(
                fieldName,
                modelFields[fieldName],
                getDisplayValue[fieldName]
              )
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          const promises = [];
          const drinksToLink = [];
          const drinksToUnLink = [];
          const drinksSet = new Set();
          const linkedDrinksSet = new Set();
          drinks.forEach((r) => drinksSet.add(getIDValue.drinks?.(r)));
          linkedDrinks.forEach((r) =>
            linkedDrinksSet.add(getIDValue.drinks?.(r))
          );
          linkedDrinks.forEach((r) => {
            if (!drinksSet.has(getIDValue.drinks?.(r))) {
              drinksToUnLink.push(r);
            }
          });
          drinks.forEach((r) => {
            if (!linkedDrinksSet.has(getIDValue.drinks?.(r))) {
              drinksToLink.push(r);
            }
          });
          drinksToUnLink.forEach((original) => {
            if (!canUnlinkDrinks) {
              throw Error(
                `Drink ${original.id} cannot be unlinked from Category because categoryDrinksId is a required field.`
              );
            }
            promises.push(
              client.graphql({
                query: updateDrink.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    categoryDrinksId: null,
                  },
                },
              })
            );
          });
          drinksToLink.forEach((original) => {
            promises.push(
              client.graphql({
                query: updateDrink.replaceAll("__typename", ""),
                variables: {
                  input: {
                    id: original.id,
                    categoryDrinksId: categoryRecord.id,
                  },
                },
              })
            );
          });
          const modelFieldsToSave = {
            name: modelFields.name,
          };
          promises.push(
            client.graphql({
              query: updateCategory.replaceAll("__typename", ""),
              variables: {
                input: {
                  id: categoryRecord.id,
                  ...modelFieldsToSave,
                },
              },
            })
          );
          await Promise.all(promises);
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "CategoryUpdateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              drinks,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <ArrayField
        onChange={async (items) => {
          let values = items;
          if (onChange) {
            const modelFields = {
              name,
              drinks: values,
            };
            const result = onChange(modelFields);
            values = result?.drinks ?? values;
          }
          setDrinks(values);
          setCurrentDrinksValue(undefined);
          setCurrentDrinksDisplayValue("");
        }}
        currentFieldValue={currentDrinksValue}
        label={"Drinks"}
        items={drinks}
        hasError={errors?.drinks?.hasError}
        runValidationTasks={async () =>
          await runValidationTasks("drinks", currentDrinksValue)
        }
        errorMessage={errors?.drinks?.errorMessage}
        getBadgeText={getDisplayValue.drinks}
        setFieldValue={(model) => {
          setCurrentDrinksDisplayValue(
            model ? getDisplayValue.drinks(model) : ""
          );
          setCurrentDrinksValue(model);
        }}
        inputFieldRef={drinksRef}
        defaultFieldValue={""}
      >
        <Autocomplete
          label="Drinks"
          isRequired={false}
          isReadOnly={false}
          placeholder="Search Drink"
          value={currentDrinksDisplayValue}
          options={drinksRecords
            .filter((r) => !drinksIdSet.has(getIDValue.drinks?.(r)))
            .map((r) => ({
              id: getIDValue.drinks?.(r),
              label: getDisplayValue.drinks?.(r),
            }))}
          isLoading={drinksLoading}
          onSelect={({ id, label }) => {
            setCurrentDrinksValue(
              drinksRecords.find((r) =>
                Object.entries(JSON.parse(id)).every(
                  ([key, value]) => r[key] === value
                )
              )
            );
            setCurrentDrinksDisplayValue(label);
            runValidationTasks("drinks", label);
          }}
          onClear={() => {
            setCurrentDrinksDisplayValue("");
          }}
          onChange={(e) => {
            let { value } = e.target;
            fetchDrinksRecords(value);
            if (errors.drinks?.hasError) {
              runValidationTasks("drinks", value);
            }
            setCurrentDrinksDisplayValue(value);
            setCurrentDrinksValue(undefined);
          }}
          onBlur={() => runValidationTasks("drinks", currentDrinksDisplayValue)}
          errorMessage={errors.drinks?.errorMessage}
          hasError={errors.drinks?.hasError}
          ref={drinksRef}
          labelHidden={true}
          {...getOverrideProps(overrides, "drinks")}
        ></Autocomplete>
      </ArrayField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || categoryModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || categoryModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
