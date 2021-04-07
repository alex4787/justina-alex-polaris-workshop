import React, {useState, useCallback} from 'react';

import {
  Page,
  Card,
  TextField,
  FormLayout,
  ChoiceList,
  RangeSlider,
} from '@shopify/polaris';

function NewReview() {
  // const [rangeValue, setRangeValue] = useState(0);

  // const handleRangeSliderChange = useCallback(
  //   (value) => setRangeValue(value),
  //   [],
  // );

  const [selected, setSelected] = useState(['hidden']);

  const handleChange = useCallback((value) => setSelected(value), []);

  return (
    <Page title="New review" breadcrumbs={[{content: 'All reviews', url: '/'}]} primaryAction={{content: 'Submit'}}>
      <Card title="Add a new review" sectioned>
        <FormLayout>
          <TextField label="Name" />
          <TextField label="Product Name" />
          {/* <TextField label="Product Rating" /> */}
          {/* <RangeSlider
            output
            label="Product Rating"
            min={0}
            max={5}
            step={1}
            value={rangeValue}
            onChange={handleRangeSliderChange}
          /> */}
          <ChoiceList
            title="Product Rating"
            choices={[
              {label: '1', value: '1'},
              {label: '2', value: '2'},
              {label: '3', value: '3'},
              {label: '4', value: '4'},
              {label: '5', value: '5'},
            ]}
            selected={selected}
            onChange={handleChange}
          />
          <TextField label="Review" multiline={4} />
        </FormLayout>
      </Card>
    </Page>
  );
}

export default NewReview;
